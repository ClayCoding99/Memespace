import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { updateProfile } from '../../util/clientHTTPFunctions';
import { SketchPicker } from 'react-color';

function EditProfileModal(props) {

    const primaryColor = "#000000"

    const [profileData, setProfileData] = useState({
        displayname: props.user?.displayname || '',
        bio: props.user?.bio || '',
        profilePicture: null,
        profilePicturePreview: null,
        gender: props.user?.gender || '',
        bannerColor: props.user?.bannerColor || primaryColor,
    });

    async function handleSubmit(event) {
        event.preventDefault();

        console.log(profileData.profilePicture);
        const response = await updateProfile(profileData);
        if (response.error) {
            Swal.fire({
                title: 'Failed to update profile',
                text: response.error,
                icon: 'fail',
                confirmButtonText: 'OK',
            });
        } else {
            props.setUser(response.user);
            // Display success popup
            Swal.fire({
                title: 'Success',
                text: 'Your profile was successfully updated!',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        }
        props.handleClose();
    }

    function handleChange(e) {
        const hex = e.hex;

        if (hex) {
            console.log(hex);
            setProfileData((prevProfileData) => ({
                ...prevProfileData,
                bannerColor: hex,
            }));
            return;
        }

        const { name, value, files} = e.target;

        if (name === 'profilePicture') {
            // Handle image file upload
            const file = files[0];
    
            // Use the functional form of setState for asynchronous updates
            setProfileData(prevProfileData => ({
                ...prevProfileData,
                [name]: file,
            }));
    
            // Display a preview of the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prevProfileData => ({
                    ...prevProfileData,
                    profilePicturePreview: reader.result,
                }));
            };
            reader.readAsDataURL(file);
            return;
        } 

        // Handle other input changes
        setProfileData(prevProfileData => ({
            ...prevProfileData,
            [name]: value,
        }));
    }

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Form encType="multipart/form-data" as="form" onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="updateProfileForm.ControlDisplayName">
                            <Form.Label>Display name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Your display name" 
                                autoFocus
                                name="displayname"
                                value={profileData.displayname}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="updateProfileForm.ControlProfilePicture">
                            <Form.Label>{props.user?.profilePictureURL ? "Upload profile picture" : "Change profile picture"}</Form.Label>
                            <Form.Control
                                type="file"
                                name="profilePicture"
                                onChange={handleChange}
                            />
                            {profileData.profilePicturePreview && (
                                <>
                                    <br/>
                                    <img
                                        src={profileData.profilePicturePreview}
                                        alt="Selected Profile"
                                        style={{ width: 100, height: 100 }}
                                    />
                                </>
                            )}
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="updateProfileForm.ControlBio"
                        >
                            <Form.Label>Bio</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder={'Your bio'}
                                name="bio"
                                value={profileData.bio}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="updateProfileForm.ControlGender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                                name="gender"
                                value={profileData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Prefer not to say</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="updateProfileForm.ControlColor">
                            <Form.Label>Banner Color</Form.Label>
                            <SketchPicker color={profileData.bannerColor} onChange={handleChange} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="primary">
                            Save Changes
                        </Button>
                        <Button variant="secondary" onClick={props.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default EditProfileModal;