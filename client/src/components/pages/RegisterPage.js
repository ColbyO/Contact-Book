import React,{useState, useEffect} from 'react'
import './css/main.css'
import axios from 'axios'
// COMPONENTS
import logo from "../img/logo.png"
import { Link } from 'react-router-dom'
// BOOTSTRAP
import { Form, Card, Alert } from "react-bootstrap"
// MATERIAL UI
import { FormControl, Input, InputLabel, InputAdornment, Button as Button1 } from '@material-ui/core'
import AccountCircle from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

function RegisterPage({ history }) {
    // Input setStates
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    // Show user Error
    const [error, setError] = useState("")

    // if user has Token push to Search Page
    useEffect(()=> {
        if(localStorage.getItem("authToken")) {
            history.push("/")
        }
    }, [history])

    // Register Function
    const registerHandler = async (e) => {
        e.preventDefault();

        //Header for post request
        const config = {
            header: {
                "Content-Type": "application/json"
            }
        }

        // check password & confirm password 
        if(password !== confirmPassword){
            setPassword("");
            setConfirmPassword("");
            setTimeout(()=> {
                setError("")
            }, 5000)
            return setError("Passwords do not match.")
        }
        try {
            // Post req. then set token and push user to search page
            const { data } = await axios.post("/api/auth/register", {username, email, password, config})
            localStorage.setItem("authToken", data.token)
            history.push("/")
        } catch (err) {
            // show user error if fail req.
            setError(error.response.data.error)
            setTimeout(()=>{
                setError("")
            }, 5000)
        }
        setLoading(false)
    }

    return (
      <div>
        <unAuthNavbar />
        <div className="w-100" style={{ maxWidth: "600px", marginLeft: "34.4%", marginTop: "10.3%" }}>
        <Card style={{height: "534px", boxShadow: "0px 1px 100px 4px rgba(0,0,0,0.41)", borderRadius: "15px"}}>
        <Card.Body>
          {/*************************** TITLE ***************************/}
          <header style={{display: "flex", flexWrap: "wrap", alignItems: "center", gap: "25px", marginLeft: "12%"}}>
          <h1 >The Important Book</h1> 
          <img src={logo} alt="" width="50" height="50" />
          </header>
          <p style={{marginLeft: "30%"}}>Search for the right person.</p>
          <h2 className="text-center mb-4" style={{marginTop: "5%", marginLeft: "-3%", textDecoration: "underline"}}>Sign Up</h2>
          {/*************************** IF ERROR ***************************/}
          {error && <Alert variant="danger">{error}</Alert>}
          {/*************************** FORM ***************************/}
          <Form onSubmit={registerHandler}  style={{marginTop: "7%"}}>
            <section style={{marginLeft: "10%"}}>
              {/*************************** USERNAME INPUT ***************************/}
            <FormControl style={{width: "90%"}}>
              <InputLabel htmlFor="username" >Username</InputLabel>
              <Input id="username" startAdornment={<InputAdornment position="start"><AccountCircle /></InputAdornment>} required type="username" onChange={(e)=> setUsername(e.target.value)}/>
            </FormControl >
            {/*************************** EMAIL INPUT ***************************/}
            <FormControl style={{width: "90%"}}>
              <InputLabel htmlFor="email" >Email</InputLabel>
              <Input id="email" startAdornment={<InputAdornment position="start"><EmailIcon /></InputAdornment>} required type="email" onChange={(e)=> setEmail(e.target.value)}/>
            </FormControl>
            {/*************************** PASSWORD INPUT ***************************/}
            <FormControl style={{width: "90%"}}>
              <InputLabel htmlFor="password" >Password</InputLabel>
              <Input id="password" startAdornment={<InputAdornment position="start"><VpnKeyIcon /></InputAdornment>} type="password" required onChange={(e)=> setPassword(e.target.value)}/>
            </FormControl>
            {/*************************** CONFIRM PASSWORD INPUT ***************************/}
            <FormControl style={{width: "90%"}}>
              <InputLabel htmlFor="password-confirm" >Confirm Passoword</InputLabel>
              <Input id="password-confirm" startAdornment={<InputAdornment position="start"><VpnKeyIcon /></InputAdornment>} type="password" required onChange={(e)=> setConfirmPassword(e.target.value)}/>
            </FormControl>
            </section>
            {/*************************** SIGNUP BUTTON ***************************/}
            <section style={{marginTop: "30px"}}>
              <Button1 disabled={loading} className="w-100" type="submit"variant="contained" color="primary">
                Sign Up
              </Button1>
            </section>
          </Form>
        </Card.Body>
        {/*************************** LOG IN LINK ***************************/}
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