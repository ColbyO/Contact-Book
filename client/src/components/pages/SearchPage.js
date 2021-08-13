import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, InputGroup, Dropdown, DropdownButton, FormControl as FormControlBoot } from 'react-bootstrap'
import {Button, IconButton} from '@material-ui/core'
import ListSearches from '../page components/ListSearches'
import NavBar from '../page components/NavBar'

import MoreVertIcon from '@material-ui/icons/MoreVert';

import { FormControl, Radio, RadioGroup, FormControlLabel, FormLabel } from '@material-ui/core';

function SearchPage({history}) {
    // const [user, setUser] = useState("")
    const [search, setSearch] = useState("")
    const [searchTerm, setSearchTerm] = useState()
    const [database, setDatabase] = useState("Database")
    const [filterOpen, setFilterOpen] = useState(false)
    const [radio, setRadio] = useState('firstname');

    useEffect(()=> {
        if(!localStorage.getItem("authToken")) {
            history.push("/login")
        }

    }, [history])

    const getAllContacts = async () => {
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
                    user: "TEST USER",
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
                    user: "TEST USER",
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
                    user: "TEST USER",
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

    function filterOpenFunc() {
        if (filterOpen === true) {
            setFilterOpen(false)
        } else {
            setFilterOpen(true)
        }
    }

    const handleChange = (event) => {
        setRadio(event.target.value);
      };

    return (
        <>
        <NavBar/>
        <Container className="mt-5">
        <InputGroup className="mb-3">
            <DropdownButton
            variant="outline-secondary"
            title={database}
            id="input-group-dropdown-1"
            >
            <Dropdown.Item href="#" onClick={() => setDatabase("PostgreSQL")}>PostgreSQL</Dropdown.Item>
            <Dropdown.Item href="#" onClick={() => setDatabase("MongoDB")}>MongoDB</Dropdown.Item>
            <Dropdown.Item href="#" onClick={() => setDatabase("Both")}>Both</Dropdown.Item>
            </DropdownButton>
            <FormControlBoot aria-label="Text input with dropdown button" placeholder="Search..." onChange={(e)=> setSearch(e.target.value)}/> 
            <Button onClick={getAllContacts} variant="contained" color="primary">Search</Button>
            <IconButton aria-label="filter" onClick={() => filterOpenFunc()}>
                <MoreVertIcon />
            </IconButton>
            {
                filterOpen ? 
                <FormControl component="fieldset" style={{width:"350px", height:"50px", marginLeft: "15px", marginRight: "15px", marginTop: "-30px"}}>
                <FormLabel component="legend">Filter By:</FormLabel>
                <RadioGroup aria-label="filter" name="filterby" value={radio} onChange={handleChange}>
                  <FormControlLabel value="firstname" control={<Radio />} label="First Name" />
                  <FormControlLabel value="lastname" control={<Radio />} label="Last Name" />
                  <FormControlLabel value="email" control={<Radio />} label="Email" />
                  <FormControlLabel value="phone" control={<Radio />} label="Phone"  style={{marginLeft: "150px", marginTop: "-127px"}} />
                  <FormControlLabel value="streetaddress" control={<Radio />} label="Street Address" style={{marginLeft: "150px"}} />
                </RadioGroup>
              </FormControl>
                : <p></p>
            }
        </InputGroup>
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
