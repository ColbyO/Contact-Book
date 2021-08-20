import React,{useState, useEffect} from 'react'
import axios from 'axios'
// COMPONENTS
import NavBar from '../page components/NavBar'
// BOOTSTRAP
import { Container, Form, Button, Card, Alert } from "react-bootstrap"


function Settings() {
    const [currentUser, setCurrentUser] = useState()
    // Input setStates
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [loading] = useState(false)
    const [error, setError] = useState("")

    // get current user info for form
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
        // set res object to array
        setCurrentUser(currentUser.data)
        // set users email to setstate
        setEmail(currentUser.data.email)
    }

    // run function on launch
    useEffect(() => {
        getCurrentUser()
    }, [])

    // update user settings function
    const updateHandler = async (e) => {
        e.preventDefault();

        // check passwords
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
                    // id to find exact account in database
                    id: currentUser._id,
                    // email & password to update
                    email: email,
                    password: password
                }
            })
            // if successful, push user back to search page
            if(data){
                window.location = "/"
            }
        } catch (err) {
            // show error if error
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
          {/******************* TITLE *******************/}
          <h2 className="text-center mb-4">Update Settings</h2>
          {/******************* IF ERORR *******************/}
          {error && <Alert variant="danger">{error}</Alert>}
          {/******************* FORM *******************/}
          <Form onSubmit={updateHandler}>   
            {/******************* EMAIL *******************/}         
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" onChange={(e)=> setEmail(e.target.value)} placeholder="dd" required />
            </Form.Group>
            {/******************* PASSWORD *******************/}
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" onChange={(e)=> setPassword(e.target.value)} required />
            </Form.Group>
            {/******************* CONFIRM PASSWORD *******************/}
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" onChange={(e)=> setConfirmPassword(e.target.value)} required />
            </Form.Group>
            {/******************* UPDATE BUTTON *******************/}
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