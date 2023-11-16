import React from 'react'

import { Modal, Form, Button} from 'react-bootstrap';

import { useState } from 'react';
import Swal from 'sweetalert2';

import { createPost } from '../../util/clientHTTPFunctions';

export default function PostModal(props) {

    const [postData, setPostData] = useState({
        userID: props.user?.email || '',
        title: '',
        postFile: null,
        fileType: null,
        fileReview: null,
        description: ''
    });

    async function handleSubmit(event) {
        event.preventDefault();

        console.log(postData);
        const response = await createPost(postData);
        if (response.post !== null) {
            Swal.fire({
                title: 'Success',
                text: 'Your post was successfully created!',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } else {
            Swal.fire({
                title: 'Failed to create post',
                text: response.error,
                icon: 'fail',
                confirmButtonText: 'OK',
            });
        }
        props.handleClose();
    }

    function handleChange(e) {
        const { name, value, files } = e.target;

        if (name === 'postFile') {
            // Handle image file upload
            const file = files[0];
    
            // Use the functional form of setState for asynchronous updates
            setPostData(prevPostData => ({
                ...prevPostData,
                [name]: file,
                fileType: file.type
            }));
    
            // Display a preview of the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPostData(prevPostData => ({
                    ...prevPostData,
                    fileReview: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        } else {
            // Handle other input changes
            setPostData(prevPostData => ({
                ...prevPostData,
                [name]: value,
            }));
        }
    }

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Form encType="multipart/form-data" as="form" onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="createPost.Title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the title for your post" 
                                autoFocus
                                name="title"
                                value={postData.title}
                                onChange={handleChange}
                            />
                    </Form.Group>
                            <Form.Group
                            className="mb-3"
                            controlId="createPost.File"
                        >
                            <Form.Label>Upload image</Form.Label>
                            <Form.Control
                                type="file"
                                name="postFile"
                                value={postData.file}
                                onChange={handleChange}
                            />
                            {postData.fileReview && (
                                <>
                                    <br/>
                                    <img
                                        src={postData.fileReview}
                                        alt="Selected Image"
                                        style={{ width: 100, height: 100 }}
                                    />
                                </>
                            )}
                        </Form.Group>
                        

                        <Form.Group className="mb-3" controlId="createPost.Description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={postData.description}
                                onChange={handleChange}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="primary">
                            Create Post!
                        </Button>
                        <Button variant="secondary" onClick={props.handleClose}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );

}
