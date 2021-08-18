import React, {useState, useEffect} from 'react'
import { Navbar, Container, NavDropdown, Nav } from 'react-bootstrap'
import axios from 'axios'

function NavBar() {
    const [username, setUsername] = useState("")

    const logoutHandler = () => {
        localStorage.removeItem("authToken")
        window.location = "/login"
    }

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

    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
        <Navbar variant="dark" bg="primary">
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