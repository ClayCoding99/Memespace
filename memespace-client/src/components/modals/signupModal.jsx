import { faEnvelope, faLock, faPerson, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react'
import { Button, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap';

import Swal from "sweetalert2"

import './modal.scss';
import { AuthContext } from '../../context/AuthContext';

export default function AuthModal(props) {

    const {signup} = useContext(AuthContext);

    const [formData, setFormData] = useState({
      displayname: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    const handleChange = (e) => {
      const {name, value} = e.target;
      setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return; 
      }

      const isValidEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(formData.email);
      if (!isValidEmail) {
        alert("Must have a valid email!");
        return; 
      }

      if (!formData.displayname || (formData.displayname.length > 50 || formData.displayname.length < 1)) {
        alert("invalid display name, must be between (1 - 50) characters"); 
        return; 
      } 

      const response = await signup(formData.displayname, formData.email, formData.password);

      if (!response.error) {
        Swal.fire({
          title: "Account created!",
          icon: "success",
        }).then((result) => {
            window.location.reload();
        });
      } else {
        Swal.fire({
          title: "Failed to create account",
          text: response.error,
          icon: 'error',
        });
      }
    };

    return (
      <Modal show={props.show} onHide={props.onHide} centered>
        <Form as="form" onSubmit={handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>Sign up</Modal.Title>
            </Modal.Header>
            <Modal.Body>                    
                <Form.Group className="mb-3" controlId="SignupForm.ControlDisplayname">
                  <Form.Label>Display name</Form.Label>
                  <Form.Control
                      type="text"
                      placeholder="Enter your display name" 
                      autoFocus
                      name="displayname"
                      value={formData.displayname}
                      onChange={handleChange}
                  />
                </Form.Group>  
                <Form.Group className="mb-3" controlId="SignupForm.ControlEmail">
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
                  
                <Form.Group className="mb-3" controlId="SignupForm.ControlPassword">  
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
                <Form.Group className="mb-3" controlId="SignupForm.ControlConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                      type="password"
                      placeholder="Enter your password again" 
                      autoFocus
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                  />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit" variant="primary">
                    Sign up!
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

