import {React, useContext } from 'react';

import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import './navbar.scss'; // Import a custom CSS file
import { useState, useEffect } from 'react';
import SignupModal from '../components/modals/signupModal';
import { AuthContext } from '../context/AuthContext';
import ProfileListItem from '../components/profile-list-item/profileListItem';
import LoginModal from '../components/modals/loginModal';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export function MyNavbar({setActiveSideLink}) {
  const navigate = useNavigate();

  const [modalAuthShow, setModalAuthShow] = useState(false);
  const [modalLoginShow, setModalLoginShow] = useState(false);

  const { auth } = useContext(AuthContext);
  const { user, userLoading } = useUser();

  function switchModals() {
    if (modalAuthShow) {
      setModalAuthShow(false);
      setModalLoginShow(true);
    } else {
      setModalLoginShow(false);
      setModalAuthShow(true);
    }
  }

  if (auth) {
    if (userLoading) {
      return <div>Loading...</div>
    }
  }

  return (
    <Navbar variant="dark" collapseOnSelect expand="lg" sticky="top" className="custom-navbar">
      <Container>
        <Navbar.Brand href="/home">Memespace</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/messaging">Messaging</Nav.Link>
            <Nav.Link href="#pricing">Notifications</Nav.Link>
            <NavDropdown title="Groups" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Group1</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Group2
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Group3</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Some other thing
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
          <Nav.Link onClick={() => {
              if (auth) {
                console.log("Redirecting to /profile");
                setActiveSideLink("/Profile");
                navigate("/profile");
              } else {
                console.log("Opening Login Modal");
                setModalLoginShow(true);
              }
            }} href="">
              {!auth ? "Signup/Login" : <ProfileListItem user={user} />}
            </Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>

      <SignupModal
        switchModals={switchModals}
        show={modalAuthShow}
        onHide={() => setModalAuthShow(false)}
      />

      <LoginModal
        switchModals={switchModals}
        show={modalLoginShow}
        onHide={() => setModalLoginShow(false)}
      />
    </Navbar>
  );
}

export default MyNavbar;