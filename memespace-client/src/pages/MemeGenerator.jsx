import React, { useState, useRef, useEffect } from 'react';
import './MemeGenerator.scss';
import { FloatingLabel, Form, Button, Modal} from 'react-bootstrap';


export default function MemeGenerator() {
    const canvasRef = useRef(null);

    const [meme, setMeme] = useState(null);
    const [fileName, setFileName] = useState('meme.png');

    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    useEffect(() => {
        const cachedMeme = JSON.parse(localStorage.getItem("meme"));
        if (cachedMeme) {
            setMeme(prevMeme => ({
                ...prevMeme,
                ...cachedMeme
            }));
        } else {
            setMeme({
                file: null,
                fileURL: null,
                topText: "",
                bottomText: "",
            });
        }
    }, []);

    function handleOnChange(e) {
        const { name, value } = e.target;
        if (name === 'file') {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    setMeme({
                        ...meme,
                        file: reader.result, // Store the file itself, not just the URL
                        fileURL: reader.result,
                    });

                    // Draw canvas here immediately after setting the image
                    drawCanvas(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setMeme({
                ...meme,
                [name]: value,
            });
        }
    }

    // when changing the image, update the canvas
    useEffect(() => {
        if (meme) {
            localStorage.setItem("meme", JSON.stringify(meme));
        }
        drawMemeCanvas();
    }, [meme]);

    function drawMemeCanvas() {
        if (canvasRef.current && meme?.file) {
            // turn the file into an image format
            const ctx = canvasRef.current.getContext('2d');
            const image = new Image();
            image.src = meme.file;

            // prepare font size and location and offset on the canvas for the text
            const fontSize = image.width / 20;
            const yOffset = image.height / 24;
            image.onload = () => {
                // draw image
                canvasRef.current.width = image.width;
                canvasRef.current.height = image.height;
                ctx.drawImage(image, 0, 0);

                // prepare text
                ctx.strokeStyle = "black";
                ctx.lineWidth = Math.floor(fontSize / 4);
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.lineJoin = "round";
                ctx.font = `${fontSize}px sans-serif`;

                // Top text
                ctx.textBaseline = "top";
                ctx.strokeText(meme.topText, image.width / 2, yOffset);
                ctx.fillText(meme.topText, image.width / 2, yOffset);

                // Bottom text
                ctx.textBaseline = "bottom";
                ctx.strokeText(meme.bottomText, image.width / 2, image.height - yOffset);
                ctx.fillText(meme.bottomText, image.width / 2, image.height - yOffset);
            };
        }
    }

    function handleGenerateMeme() {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const image = canvas.toDataURL("image/png");
            downloadImage(image);
        } else {
            alert("must create a meme first!");
        }
        handleClose();
    }

    function downloadImage(image) {
        // create a temporary link with the image, click it, then remove it
        const link = document.createElement('a');
        link.href = image;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Export Meme</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form.Group controlId="fileName">
                    <Form.Label>File Name:</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter file name"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    />
                </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleGenerateMeme}>
                    Export
                </Button>
                </Modal.Footer>
            </Modal>

            <div className="home-container">
                <div className="meme-generator">
                    <Form.Control type="file" name="file" onChange={handleOnChange} placeholder="Upload image" />
                
                    {meme?.file && 
                        <>
                            <FloatingLabel controlId="floatingTopText" label="Top Text">
                                <Form.Control type="text" name="topText" onChange={handleOnChange} value={meme.topText} placeholder="Enter meme top text" />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingBottomText" label="Bottom Text">
                                <Form.Control type="text" name="bottomText" onChange={handleOnChange} value={meme.bottomText} placeholder="Enter meme bottom text" />
                            </FloatingLabel>

                            <canvas ref={canvasRef} id="meme"></canvas>

                            <Button onClick={handleShow} variant="primary">Export meme</Button>
                        </>
                    }
                </div>

                {/* <TextEditor /> */}
            </div>
        </>
    );
}