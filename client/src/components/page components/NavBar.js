import React, {useState, useEffect} from 'react'
import { Navbar, Container, NavDropdown, Nav } from 'react-bootstrap'
import axios from 'axios'

import logo from "../img/logo2.png"

function NavBar() {
    // username use state
    const [username, setUsername] = useState("")
    // logout function remove the token and redirect to login page
    const logoutHandler = () => {
        localStorage.removeItem("authToken")
        window.location = "/login"
    }
    // gets the current users username and sets the username state
    const getCurrentUser = async () => {
        let currentUser = await axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            },
            url: "http://localhost:5000/api/private/get/currentuser",
            data: {
                id: "1001"
            }
        })
        setUsername(currentUser.data.username)
    }
    // run function on run.
    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
        <Navbar variant="dark" bg="primary">
            <Container>
                {/* Contact Book text at top */}
                <Navbar.Brand href="/">
                <img
                    alt=""
                    src={logo}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    style={{marginRight: "7px"}}
                    />{' '}
                    The Important Book
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    {/* Text before username dropdown */}
                <Navbar.Text>
                    Signed in as:
                </Navbar.Text>
                <Nav>
                    {/* Dropdown menu for settings, bookmarks, history and logout */}
                    <NavDropdown
                    id="nav-dropdown"
                    title={username}
                    menuVariant="light"
                    >
                    <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                    <NavDropdown.Item href="/bookmarks">Bookmarks</NavDropdown.Item>
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