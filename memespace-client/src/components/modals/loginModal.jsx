import { faEnvelope, faLock, faPerson, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react'
import { Button, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap';

import './modal.scss';
import { AuthContext } from '../../context/AuthContext';

export default function LoginModal(props) {

    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });

    console.log(props);

    const handleChange = (e) => {
      const {name, value} = e.target;
      setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const isValidEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(formData.email);
      if (!isValidEmail) {
        alert("Must have a valid email!");
        return; 
      }

      // send account data to the server to create it
      const response = await login(formData.email, formData.password);
      if (!response.error) {
        window.location.reload();
      } else {
        alert(response.error);
      }
    };

    return (
      <Modal show={props.show} onHide={props.onHide} centered>
            <Form as="form" onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>                    
                    <Form.Group className="mb-3" controlId="loginInForm.ControlEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                          type="email"
                          placeholder="Enter your email" 
                          autoFocus
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                      />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="loginInForm.ControlPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                          type="password"
                          placeholder="Enter your password" 
                          autoFocus
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                      />
                      </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" variant="primary">
                        Save Changes
                    </Button>
                    <Button variant="secondary" onClick={props.onHide}>
                        Close
                    </Button>
                </Modal.Footer>
                <a className="modal-link" onClick={props.switchModals}>Don't have an account? Click here to sign up!</a>
            </Form>
        </Modal>
    );
}