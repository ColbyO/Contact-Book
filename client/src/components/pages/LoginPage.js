import React, {useState, useEffect} from 'react'
import './css/main.css'
import axios from 'axios'

// COMPONENTS
import { Link } from 'react-router-dom'
import logo from "../img/logo.png"
// BOOTSTRAP
import { Form, Card, Alert } from "react-bootstrap"
// MATERIAL UI
import { FormControl, Input, InputLabel, InputAdornment, Button as Button1 } from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

function LoginPage({history}) {
   // useStates for inputs
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // useStates for functions
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // On load if theres a authToken push to Search Page
    useEffect(()=> {
        if(localStorage.getItem("authToken")) {
            history.push("/")
        }
    }, [history])

    // log in function
    const loginHandler = async (e) => {
        e.preventDefault();

        const config = {
            header: {
                "Content-Type": "application/json"
              }
        }
        try {
            // post req, then set Token to LS and push user to Search Page
            const { data } = await axios.post("/api/auth/login", {email, password, config})
            localStorage.setItem("authToken", data.token)
            history.push("/")
        } catch (err) {
            // Show user Error for 5 seconds
            setError("Incorrect password.")
            setTimeout(()=>{
                setError("")
            }, 5000)
        }
        setLoading(false)
    }

    return (
      <div>
        <div className="w-100" style={{ maxWidth: "600px", marginLeft: "34.4%", marginTop: "10.3%" }}>
        <Card style={{height: "534px", borderRadius: "15px", boxShadow: "0px 1px 100px 4px rgba(0,0,0,0.41)"}}>
        <Card.Body>
          {/*************************** TITLE ***************************/}
          <header style={{display: "flex", flexWrap: "wrap", alignItems: "center", gap: "25px", marginLeft: "12%"}}>
          <h1>The Important Book</h1> 
          <img src={logo} alt="" width="50" height="50" />
          </header>
          <p style={{marginLeft: "30%"}}>Search for the right person.</p>
          <h2 className="text-center mt-5" style={{marginLeft: "-3%", textDecoration: "underline"}}>Log In</h2>
          {/*************************** IF ERROR  ***************************/}
          {error && <Alert variant="danger" style={{position: "absolute", marginLeft: "33%"}}>{error}</Alert>}
          {/*************************** FORM ***************************/}
            <Form style={{marginTop: "10%"}} onSubmit={loginHandler}>
              {/*************************** INPUT ***************************/}
            <section style={{marginLeft: "10%"}}>
              {/*************************** EMAIL INPUT ***************************/}
            <FormControl style={{width: "90%"}}>
              <InputLabel htmlFor="email" >Email</InputLabel>
              <Input id="email" startAdornment={<InputAdornment position="start"><EmailIcon /></InputAdornment>} required type="email" onChange={(e)=> setEmail(e.target.value)} />
            </FormControl>
            {/*************************** PASSWORD INPUT ***************************/}
            <FormControl style={{width: "90%"}} >
              <InputLabel htmlFor="password" >Password</InputLabel>
              <Input id="password" startAdornment={<InputAdornment position="start"><VpnKeyIcon /></InputAdornment>} type="password" required  onChange={(e)=> setPassword(e.target.value)}/>
            </FormControl>
            </section>
            {/*************************** LOG IN BUTTON ***************************/}
            <section style={{marginTop: "71px"}}>
              <Button1 disabled={loading} className="w-100" type="submit"variant="contained" color="primary">
                Log In
              </Button1>
            </section>
          </Form>
        </Card.Body>
        {/*************************** REGISTER LINK ***************************/}
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