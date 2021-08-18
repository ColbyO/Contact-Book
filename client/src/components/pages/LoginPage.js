import React, {useState, useEffect} from 'react'
import './css/main.css'
import axios from 'axios'
import { Container, Form, Button, Card, Alert } from "react-bootstrap"
import { FormControl, Input, InputLabel, InputAdornment, Button as Button1 } from '@material-ui/core'
import { Link } from 'react-router-dom'
import NotAuthNavBar from '../page components/NotAuthNavBar'

import AccountCircle from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

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
      <div className="main-body">
        <div className="w-100" style={{ maxWidth: "600px", marginLeft: "68.4%", marginTop: "0.3%" }}>
        <Card style={{height: "934px", borderRadius: "15px", boxShadow: "0px 1px 100px 4px rgba(0,0,0,0.41)"}}>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
            <Form style={{marginTop: "20%"}} onSubmit={loginHandler}>
            <section style={{marginLeft: "10%"}}>
            <FormControl style={{width: "90%"}}>
              <InputLabel htmlFor="email" >Email</InputLabel>
              <Input id="email" startAdornment={<InputAdornment position="start"><EmailIcon /></InputAdornment>} required type="email" onChange={(e)=> setEmail(e.target.value)} />
            </FormControl>
            <FormControl style={{width: "90%"}} >
              <InputLabel htmlFor="password" >Password</InputLabel>
              <Input id="password" startAdornment={<InputAdornment position="start"><VpnKeyIcon /></InputAdornment>} type="password" required  onChange={(e)=> setPassword(e.target.value)}/>
            </FormControl>
            </section>
            <section style={{marginTop: "50px"}}>
              <Button1 disabled={loading} className="w-100" type="submit"variant="contained" color="primary">
                Log In
              </Button1>
            </section>
          </Form>
        </Card.Body>
        <Card.Footer>
        <footer className="w-100 text-center" style={{color: "black"}}>
        Need an account? <Link to="/register">Register</Link>
      </footer>
        </Card.Footer>
      </Card>
        </div>
      </div>
    )
}

export default LoginPage