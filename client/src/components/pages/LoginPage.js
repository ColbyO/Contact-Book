import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import {Button} from '@material-ui/core'

function LoginPage({history}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

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
    }

    return (
        <div>
        <form onSubmit={loginHandler}>
            <h1>Login</h1>
                <input placeholder="email" onChange={(e)=> setEmail(e.target.value)}/>
                <input placeholder="password" onChange={(e)=> setPassword(e.target.value)}/>
                <button  variant="contained" color="primary">Submit</button>
                <span>Don't have an account? <Link to="/register">Register</Link></span>
        </form>
        </div>
    )
}

export default LoginPage
