import React, { useState, useEffect } from 'react'
import axios from 'axios'
// COMPONENTS
import ListSearches from '../page components/ListSearches'
import NavBar from '../page components/NavBar'
// BOOTSTRAP
import { Container, InputGroup, Dropdown, DropdownButton, FormControl as FormControlBoot, Button as ButtonBoot, Modal, Form } from 'react-bootstrap'
// MATERIAL UI
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { FormControl, Radio, RadioGroup, FormControlLabel, FormLabel, Button, IconButton } from '@material-ui/core';


function SearchPage({history}) {
    // Input setState
    const [username, setUsername] = useState("")
    const [search, setSearch] = useState("")
    const [searchTerm, setSearchTerm] = useState()
    // Select database button
    const [database, setDatabase] = useState("Database")
    // Filter 
    const [radio, setRadio] = useState('firstname');
    // database button color
    const [databaseColor, setDatabaseColor] = useState("outline-secondary")
    // modal
    const [open, setOpen] = useState(false)

    // function to get current users username to check token
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
            // if error remove token and push user to redirect to login
            localStorage.removeItem("authToken")
            window.location = "/"
            console.log(err)
        }

    }
    // run function on launch
    useEffect(() => {
        getCurrentUser()
    }, [])
    // no token push user to login page
    useEffect(()=> {
        if(!localStorage.getItem("authToken")) {
            history.push("/login")
        }
    }, [history])

    // Search Database function
    const getAllContacts = async () => {
        // if nothing in input alert user and dont search db
        if (search === "") {
            alert("Not searching anything!")
        } else {
            // headers
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            }
            // if user selects postgresql database search postgresql database
            if (database === "PostgreSQL") {
                await axios.all([
                    axios.post("/api/private/search/postgresql", {
                    searchTerm: search,
                    searchQuery: radio
                    }, config),
                    // must also post info to log history
                    axios.post("/api/private/log/search",{
                        user: username,
                        searchTerm: search,
                        searchQuery: radio,
                        database: database
                    }, config)
            // take both datas from both post req. save database response and throw logged response.
            ]).then(axios.spread((data1, data2) => {
                setSearchTerm(data1.data.rows)
                throw data2
            }))} 
            // if user selects mongodb database search mongodb database
             if (database === "MongoDB") {
                await axios.all([
                    axios.post("/api/private/search/mongodb", {
                    searchTerm: search,
                    searchQuery: radio
                    }, config),
                    // must also post info to log history
                    axios.post("/api/private/log/search",{
                        user: username,
                        searchTerm: search,
                        searchQuery: radio,
                        database: database
                    }, config)
            // take both datas from both post req. save database response and throw logged response.
            ]).then(axios.spread((data1, data2) => {
                setSearchTerm(data1.data)
                throw data2
            }))} 
            // if user selects both databases search both databases
            if (database === "Both") {
                await axios.all([
                    // postgresql search
                    axios.post("/api/private/search/postgresql", {
                            searchTerm: search,
                            searchQuery: radio
                        }, config),
                    // mongodb search
                    axios.post("/api/private/search/mongodb", {
                            searchTerm: search,
                            searchQuery: radio
                        }, config),
                    // log info
                    axios.post("/api/private/log/search", {
                        user: username,
                        searchTerm: search,
                        searchQuery: radio,
                        database: database                    
                    }, config)
                // get all responses 
                ]).then(axios.spread((data1, data2, data3)=> {
                    // combines both array's
                    Array.prototype.push.apply(data1.data.rows, data2.data);
                    setSearchTerm(data1.data.rows)
                    // throw log response
                    throw data3
                }))
                // if user doesn't select database alert.
            } if (database === "Database") {
                return (
                    alert("No Database Selected!")
                )
            }
        }

    }

    // set filter state
    const handleChange = (event) => {
        setRadio(event.target.value);
      };

      // open filter modal
      function openModal() {
        setOpen(true)
      }
    
      // close filter modal
      function closeModal() {
        setOpen(false)
      }
    
      // prevent default for form
      function handleSubmit(e) {
        e.preventDefault()
      }

    return (
        <>
        <NavBar/>
        <Container className="mt-5">
        {/**************************** CHOOSE DATABASE  ****************************/}
        <InputGroup className="mb-3">
            <DropdownButton
            variant={databaseColor}
            title={database}
            id="input-group-dropdown-1"
            >
            {/**************************** CHOOSE POSTGRESQL DATABASE  ****************************/}
            <Dropdown.Item href="#" onClick={() => {
                setDatabase("PostgreSQL")
                setDatabaseColor("outline-primary")
                }}>PostgreSQL</Dropdown.Item>
            {/**************************** CHOOSE MONGODB DATABASE  ****************************/}
            <Dropdown.Item href="#" onClick={() => {
                setDatabase("MongoDB")
                setDatabaseColor("outline-success") 
                }}>MongoDB</Dropdown.Item>
            {/**************************** CHOOSE BOTH DATABASES  ****************************/}
            <Dropdown.Item href="#" onClick={() => {
                setDatabase("Both")
                setDatabaseColor("outline-warning")
            }}>Both</Dropdown.Item>
            </DropdownButton>
            {/**************************** SEARCH INPUT  ****************************/}
            <FormControlBoot aria-label="Text input with dropdown button" placeholder="Search..." onChange={(e)=> setSearch(e.target.value)}/> 
            <Button onClick={getAllContacts} variant="contained" color="primary" disableElevation>Search</Button>
            {/**************************** FILTER MODAL BUTTON  ****************************/}
            <IconButton aria-label="filter" onClick={openModal}>
                <MoreVertIcon color="primary"/>
            </IconButton>
            </InputGroup>
            <>
            {/**************************** FILTER MODAL  ****************************/}
            <Modal show={open} onHide={closeModal}>
                <Form onSubmit={handleSubmit} >
                <Modal.Body>
                    {/**************************** CHOOSE FILTER ****************************/}
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
                {/**************************** APPLY FILTER  ****************************/}
                  <ButtonBoot variant="primary" type="submit" onClick={closeModal}>
                    Apply
                  </ButtonBoot>
                </Modal.Footer>
                </Form>
            </Modal>
          </>

        </Container>
        <Container>
            {/**************************** LIST CONTACTS  ****************************/}
            {
                searchTerm ? 
                <ListSearches searchTerm={searchTerm} /> : <p></p>
            }
        </Container>
        </>
    )
}

export default SearchPage
