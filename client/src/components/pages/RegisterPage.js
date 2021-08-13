import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { Container, Form, Button, Card, Alert } from "react-bootstrap"
import { Link } from 'react-router-dom'

function RegisterPage({ history }) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState("")

    useEffect(()=> {
        if(localStorage.getItem("authToken")) {
            history.push("/")
        }
    }, [history])

    const registerHandler = async (e) => {
        e.preventDefault();

        const config = {
            header: {
                "Content-Type": "application/json"
            }
        }

        if(password !== confirmPassword){
            setPassword("");
            setConfirmPassword("");
            setTimeout(()=> {
                setError("")
            }, 5000)
            return setError("Passwords do not match.")
        }
        try {
            const { data } = await axios.post("/api/auth/register", {username, email, password, config})
            localStorage.setItem("authToken", data.token)
            history.push("/")
        } catch (err) {
            setError(error.response.data.error)
            setTimeout(()=>{
                setError("")
            }, 5000)
        }
        setLoading(false)
    }

    return (
        <Container
        className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={registerHandler}>
            <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="username" onChange={(e)=> setUsername(e.target.value)} required />
            </Form.Group>              
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" onChange={(e)=> setEmail(e.target.value)} required />
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
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
        </div>
      </Container>
    )
}

export default RegisterPage