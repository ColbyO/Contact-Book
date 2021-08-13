import React from 'react'
import { Navbar, Container, NavDropdown, Nav } from 'react-bootstrap'
// import axios from 'axios'

function NavBar({history}) {

    const logoutHandler = () => {
        localStorage.removeItem("authToken")
        window.location = "/login"
    }



    return (
        <Navbar bg="light" variant="light">
            <Container>
                <Navbar.Brand href="/">Contact Book</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Signed in as:
                </Navbar.Text>
                <Nav>
                    <NavDropdown
                    id="nav-dropdown"
                    title="REDO_USER"
                    menuVariant="light"
                    >
                    <NavDropdown.Item href="">Bookmarks</NavDropdown.Item>
                    <NavDropdown.Item href="/history">History</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar