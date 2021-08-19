import React, { useState} from "react";
import axios from 'axios';
import { Button, Modal, Form } from "react-bootstrap";
import {IconButton, Select, MenuItem, InputLabel, FormControl} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';


export default function AddFolderButton({ currentContact, contacts }) {
    const [allFolders, setAllFolders] = useState([])
    const [selectFolder, setSelectFolder] = useState('')
    const [open, setOpen] = useState(false)

  const getAllFolders = async () => {
      let Folders = await axios({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        url: "http://localhost:5000/api/private/get/folders",
      })
    console.log(Folders.data)
    setAllFolders(Folders.data)
  }

  const addToFolder = async () => {
    // console.log(contacts) // all info (eg. firstname, lastname, etc)
    // console.log(currentContact) // id (eg. 1078)
    if (contacts.length > 1) {
      console.log(currentContact)
      console.log(contacts)
      for(let i = 0; i < contacts.length; i++) {
        let toFolder = await axios({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        url: "http://localhost:5000/api/private/addto/folder",
        data: {
          contactID: contacts[i][0].id,
          folderID: selectFolder,
          firstname: contacts[i][0].firstname,
          lastname: contacts[i][0].lastname, 
          email: contacts[i][0].email,
          phone: contacts[i][0].phone,
          company: contacts[i][0].company,
          department: contacts[i][0].department,
          jobtitle: contacts[i][0].jobtitle
      }      
        })
        console.log(toFolder)
      }

      
    } else {
      if (contacts.firstname !== undefined) {
        let toFolder = await axios({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        url: "http://localhost:5000/api/private/addto/folder",
        data: {
            contactID: contacts.id,
            folderID: selectFolder,
            firstname: contacts.firstname,
            lastname: contacts.lastname, 
            email: contacts.email,
            phone: contacts.phone,
            company: contacts.company,
            department: contacts.department,
            jobtitle: contacts.jobtitle
        }
      })
    if (toFolder.status === 200) {
        alert("Successfully added to Folder")
    }     
      } else {
        let toFolder = await axios({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        url: "http://localhost:5000/api/private/addto/folder",
        data: {
            contactID: JSON.parse(currentContact),
            folderID: selectFolder,
            firstname: contacts[0].firstname || contacts.firstname,
            lastname: contacts[0].lastname || contacts.lastname, 
            email: contacts[0].email || contacts.email,
            phone: contacts[0].phone || contacts.phone,
            company: contacts[0].company || contacts.company,
            department: contacts[0].department || contacts.department,
            jobtitle: contacts[0].jobtitle || contacts.jobtitle
        }
      })
    if (toFolder.status === 200) {
        alert("Successfully added to Folder")
    }
      }
  
    }

}


  function openModal() {
    setOpen(true)
    getAllFolders()
  }

  function closeModal() {
    setOpen(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
  }

  function handleChange(e){
      setSelectFolder(e.target.value)
      console.log(e.target.value)
  }

  return (
    <>
      <IconButton onClick={openModal} variant="outline-success" size="sm">
        <StarIcon />
      </IconButton>
      <Modal show={open} onHide={closeModal}>
          <Form onSubmit={handleSubmit} >
          <Modal.Body>
            <FormControl>
              <InputLabel id="folder-select-label">Choose Folder</InputLabel>
              <Select onChange={handleChange} value={selectFolder} labelId="folder-select-label" style={{width: "200px"}}>
                    {
                        allFolders.map(keyWord => <MenuItem key={keyWord._id} value={keyWord._id}>{keyWord.folderName}</MenuItem>)
                    }
              </Select>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit" onClick={addToFolder}>
              Add Folder
            </Button>
          </Modal.Footer>
          </Form>
      </Modal>
    </>
  )
}