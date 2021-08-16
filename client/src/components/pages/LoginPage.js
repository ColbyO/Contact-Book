import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Container, Form, Button, Card, Alert } from "react-bootstrap"
import { Link } from 'react-router-dom'

function LoginPage({history}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(()=> {
        if(localStorage.getItem("authToken")) {
            history.push("/")
        }
    }, [history])

    const loginHandler = async (e) => {
        e.preventDefault();

        const config = {
            header: {
                "Content-Type": "application/json"
            }
        }

        try {
            const { data } = await axios.post("/api/auth/login", {email, password, config})
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
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}>
        <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={loginHandler}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" onChange={(e)=> setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" onChange={(e)=> setPassword(e.target.value)} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Log In
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2" style={{color: "black"}}>
        Need an account? <Link to="/register">Register</Link>
      </div>
        </div>
      </Container>
    )
}

export default LoginPage