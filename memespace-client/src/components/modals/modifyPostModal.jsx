import React from 'react'
import { Modal, ListGroup, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { deletePost } from '../../util/clientHTTPFunctions';

export default function ModifyPostModal(props) {

    function handleDeletePost() {
        Swal.fire({
            title: 'Delete Post?',
            text: 'Are you sure you want to delete this post? If you click delete, this cannot be undone!',
            icon: 'warning',
            showCancelButton: true, // Display the "Cancel" button
            confirmButtonColor: '#d33', // Customize the "Delete" button color
            cancelButtonColor: '#3085d6', // Customize the "Cancel" button color
            confirmButtonText: 'Delete', // Text on the "Delete" button
            cancelButtonText: 'Cancel', // Text on the "Cancel" button
        }).then(async (result) => {
            if (result.isConfirmed) {
                // User clicked "Delete"
                props.handleClose();
                console.log(props.post["_id"]);
                const postResponse = await deletePost(props.post["_id"]);
                if (!postResponse.error) {
                    Swal.fire({
                        title: "Successfully deleted post!",
                        icon: "success",
                    });
                    props.removePost(props.post);
                } else {
                    Swal.fire({
                        title: "Could not delete post",
                        text: postResponse.error,
                        icon: "error",
                    });
                }
            }
        });
    }

    function handleEditPost() {
        // TODO: open modal for edit post   
    }

    return (
        <Modal show={props.show} onHide={props.handleClose} centered>
            <Modal.Body>
            <ListGroup>
                <ListGroup.Item onClick={handleEditPost} action variant="primary">
                    Edit Post
                </ListGroup.Item>
                <ListGroup.Item onClick={handleDeletePost} action variant="danger">
                    Delete Post
                </ListGroup.Item>
                </ListGroup>
            </Modal.Body>
        </Modal>
    );
}