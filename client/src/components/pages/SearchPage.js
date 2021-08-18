import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, InputGroup, Dropdown, DropdownButton, FormControl as FormControlBoot } from 'react-bootstrap'
import {Button, IconButton, Select, MenuItem, InputLabel} from '@material-ui/core'
import ListSearches from '../page components/ListSearches'
import NavBar from '../page components/NavBar'
import { Button as ButtonBoot, Modal, Form } from "react-bootstrap";

import MoreVertIcon from '@material-ui/icons/MoreVert';

import { FormControl, Radio, RadioGroup, FormControlLabel, FormLabel } from '@material-ui/core';

function SearchPage({history}) {

    const [username, setUsername] = useState("")
    const [search, setSearch] = useState("")
    const [searchTerm, setSearchTerm] = useState()
    const [database, setDatabase] = useState("Database")
    const [filterOpen, setFilterOpen] = useState(false)
    const [radio, setRadio] = useState('firstname');
    const [databaseColor, setDatabaseColor] = useState("outline-secondary")
    const [open, setOpen] = useState(false)

    const getCurrentUser = async () => {
        try {
            let currentUser = await axios({
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                },
                url: "http://localhost:5000/api/private/get/currentuser",
            })
            
            setUsername(currentUser.data.username)             
        } catch (err) {
            localStorage.removeItem("authToken")
            window.location = "/"
            console.log(err)
        }

    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    useEffect(()=> {
        if(!localStorage.getItem("authToken")) {
            history.push("/login")
        }
    }, [history])

    const getAllContacts = async () => {
        if (search === "") {
            alert("Not searching anything!")
        } else {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            }
            if (database === "PostgreSQL") {
                await axios.all([
                    axios.post("/api/private/search/postgresql", {
                    searchTerm: search,
                    searchQuery: radio
                    }, config),
                    axios.post("/api/private/log/search",{
                        user: username,
                        searchTerm: search,
                        searchQuery: radio,
                        database: database
                    }, config)
            ]).then(axios.spread((data1, data2) => {
                setSearchTerm(data1.data.rows)
                throw data2
            }))} 
             if (database === "MongoDB") {
                await axios.all([
                    axios.post("/api/private/search/mongodb", {
                    searchTerm: search,
                    searchQuery: radio
                    }, config),
                    axios.post("/api/private/log/search",{
                        user: username,
                        searchTerm: search,
                        searchQuery: radio,
                        database: database
                    }, config)
            ]).then(axios.spread((data1, data2) => {
                setSearchTerm(data1.data)
                throw data2
            }))} 
            if (database === "Both") {
                await axios.all([
                    axios.post("/api/private/search/postgresql", {
                            searchTerm: search,
                            searchQuery: radio
                        }, config),
                    axios.post("/api/private/search/mongodb", {
                            searchTerm: search,
                            searchQuery: radio
                        }, config),
                    axios.post("/api/private/log/search", {
                        user: username,
                        searchTerm: search,
                        searchQuery: radio,
                        database: database                    
                    }, config)
                ]).then(axios.spread((data1, data2, data3)=> {
                    // combines both array's
                    Array.prototype.push.apply(data1.data.rows, data2.data);
                    setSearchTerm(data1.data.rows)
                    throw data3
                }))
            } if (database === "Database") {
                return (
                    alert("No Database Selected!")
                )
            }
        }

    }

    function filterOpenFunc() {
        if (filterOpen === true) {
            setFilterOpen(false)
        } else {
            setFilterOpen(true)
        }
    }

    const handleChange = (event) => {
        setRadio(event.target.value);
        console.log(radio)
      };


      function openModal() {
        setOpen(true)
      }
    
      function closeModal() {
        setOpen(false)
      }
    
      function handleSubmit(e) {
        e.preventDefault()
      }
    
      function handleChanges(e){
          console.log(e.target.value)
      }

    return (
        <>
        <NavBar/>
        <Container className="mt-5">
        <InputGroup className="mb-3">
            <DropdownButton
            variant={databaseColor}
            title={database}
            id="input-group-dropdown-1"
            >
            <Dropdown.Item href="#" onClick={() => {
                setDatabase("PostgreSQL")
                setDatabaseColor("outline-primary")
                }}>PostgreSQL</Dropdown.Item>
            <Dropdown.Item href="#" onClick={() => {
                setDatabase("MongoDB")
                setDatabaseColor("outline-success") 
                }}>MongoDB</Dropdown.Item>
            <Dropdown.Item href="#" onClick={() => {
                setDatabase("Both")
                setDatabaseColor("outline-warning")
            }}>Both</Dropdown.Item>
            </DropdownButton>
            <FormControlBoot aria-label="Text input with dropdown button" placeholder="Search..." onChange={(e)=> setSearch(e.target.value)}/> 
            <Button onClick={getAllContacts} variant="contained" color="primary" disableElevation>Search</Button>
            <IconButton aria-label="filter" onClick={openModal}>
                <MoreVertIcon color="primary"/>
            </IconButton>
            </InputGroup>
            <>
            <Modal show={open} onHide={closeModal}>
                <Form onSubmit={handleSubmit} >
                <Modal.Body>
                        <FormControl component="fieldset"  >
                            <FormLabel component="legend">Filter By:</FormLabel>
                        <RadioGroup  aria-label="filter" name="filterby" value={radio} onChange={handleChange} >
                            <FormControlLabel  value="firstname" control={<Radio />} label="First Name" />
                            <FormControlLabel value="lastname" control={<Radio  />} label="Last Name" />
                            <FormControlLabel value="email" control={<Radio  />} label="Email" />
                            <FormControlLabel value="phone" control={<Radio  />} label="Phone" />
                            <FormControlLabel value="company" control={<Radio  />} label="Company"  />
                            <FormControlLabel value="department" control={<Radio  />} label="Department" />
                            <FormControlLabel value="jobtitle" control={<Radio  />} label="Job Title" />
                    </RadioGroup>
                 </FormControl>
                </Modal.Body>
                <Modal.Footer>
                  <ButtonBoot variant="success" type="submit" onClick={closeModal}>
                    Apply
                  </ButtonBoot>
                </Modal.Footer>
                </Form>
            </Modal>
          </>

        </Container>
        <Container>
            {
                searchTerm ? 
                <ListSearches searchTerm={searchTerm} /> : <p></p>
            }
        </Container>
        </>
    )
}

export default SearchPage
