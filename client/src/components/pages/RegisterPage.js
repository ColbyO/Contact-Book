import React,{useState, useEffect} from 'react'
import './css/main.css'
import axios from 'axios'
import { Form, Card, Alert } from "react-bootstrap"
import { FormControl, Input, InputLabel, InputAdornment, Button as Button1 } from '@material-ui/core'
import { Link } from 'react-router-dom'

import AccountCircle from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

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
      <div>
        <div className="w-100" style={{ maxWidth: "600px", marginLeft: "34.4%", marginTop: "10.3%" }}>
        <Card style={{height: "534px", boxShadow: "0px 1px 100px 4px rgba(0,0,0,0.41)", borderRadius: "15px"}}>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={registerHandler}  style={{marginTop: "12%"}}>
            <section style={{marginLeft: "10%"}}>
            <FormControl style={{width: "90%"}}>
              <InputLabel htmlFor="username" >Username</InputLabel>
              <Input id="username" startAdornment={<InputAdornment position="start"><AccountCircle /></InputAdornment>} required type="username" onChange={(e)=> setUsername(e.target.value)}/>
            </FormControl >
            <FormControl style={{width: "90%"}}>
              <InputLabel htmlFor="email" >Email</InputLabel>
              <Input id="email" startAdornment={<InputAdornment position="start"><EmailIcon /></InputAdornment>} required type="email" onChange={(e)=> setEmail(e.target.value)}/>
            </FormControl>
            <FormControl style={{width: "90%"}}>
              <InputLabel htmlFor="password" >Password</InputLabel>
              <Input id="password" startAdornment={<InputAdornment position="start"><VpnKeyIcon /></InputAdornment>} type="password" required onChange={(e)=> setPassword(e.target.value)}/>
            </FormControl>
            <FormControl style={{width: "90%"}}>
              <InputLabel htmlFor="password-confirm" >Confirm Passoword</InputLabel>
              <Input id="password-confirm" startAdornment={<InputAdornment position="start"><VpnKeyIcon /></InputAdornment>} type="password" required onChange={(e)=> setConfirmPassword(e.target.value)}/>
            </FormControl>
            </section>
            <section style={{marginTop: "110px"}}>
              <Button1 disabled={loading} className="w-100" type="submit"variant="contained" color="primary">
                Sign Up
              </Button1>
            </section>
          </Form>
        </Card.Body>
        <Card.Footer>
        <footer className="w-100 text-center">
          Already have an account? <Link to="/login">Log In</Link>
        </footer>
        </Card.Footer>
      </Card>
        </div>
      </div>
    )
}

export default RegisterPage