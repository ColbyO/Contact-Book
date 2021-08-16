import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { Container, Form, Button, Card, Alert } from "react-bootstrap"
import { Link } from 'react-router-dom'
import NavBar from '../page components/NavBar'

function Settings() {
    const [currentUser, setCurrentUser] = useState()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState("")

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
        setCurrentUser(currentUser.data)
        console.log(currentUser.data)
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    const updateHandler = async (e) => {
        e.preventDefault();

        if(password !== confirmPassword){
            setPassword("");
            setConfirmPassword("");
            setTimeout(()=> {
                setError("")
            }, 5000)
            return setError("Passwords do not match.")
        }
        try {
            const data  = await axios({
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                },
                url: "http://localhost:5000/api/private/update/user",
                data: {
                    id: currentUser._id,
                    email: email,
                    password: password
                }
            })
            if(data){
                window.location = "/"
            }
        } catch (err) {
            setError(error.response.data.error)
            setTimeout(()=>{
                setError("")
            }, 5000)
        }
        
    }

    return (
        <div>
            <NavBar />
        <Container
        className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", marginTop: "-150px" }}>
        <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Settings</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={updateHandler}>            
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" onChange={(e)=> setEmail(e.target.value)} placeholder="dd" required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" onChange={(e)=> setPassword(e.target.value)} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" onChange={(e)=> setConfirmPassword(e.target.value)} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
        </div>
      </Container>
      </div>
    )
}

export default Settings