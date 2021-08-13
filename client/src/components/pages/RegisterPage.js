import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import {Button} from 'react-bootstrap'

function RegisterPage({ history }) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

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
    }

    return (
        <div>
            
            <form onSubmit={registerHandler}>
            <h1>Register</h1>
            {error && <span>{error}</span>}
                <input placeholder="username" value={username} onChange={(e)=> setUsername(e.target.value)}/>
                <input placeholder="email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                <input placeholder="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                <input placeholder="confirmPassword"  value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)}/>
                <Button type="submit" >Submit</Button>

                <span> Already have an account? <Link to="login">Login</Link></span>
            </form>            
        </div>
    )
}

export default RegisterPage
