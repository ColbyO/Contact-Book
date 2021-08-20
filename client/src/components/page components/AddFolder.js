import React, { useState } from "react";
import axios from 'axios';
import { Button, Modal, Form } from "react-bootstrap";
import {IconButton} from '@material-ui/core';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';

export default function AddFolderButton({ currentUser, folderid }) {
  // for open modal
  const [open, setOpen] = useState(false)
  // name of folder user entered
  const [name, setName] = useState("")

  // post request to create new folder
  const createNewFolder = async () => {
      let newFolder = await axios({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        url: "http://localhost:5000/api/private/add/folder",
        data: {
            // folder name from useState
            folderName: name,
            // id of current user
            id: currentUser._id,
            // if folder is inside another folder its parentID would be that of the folder its inside, if not it will be ROOT, appearing on the main page.
            parentID: folderid || "ROOT"
        }
      })
      // push user to newly created folder location
      window.location = `/bookmarks/${newFolder.data._id}`
  }

  // open modal
  function openModal() {
    setOpen(true)
  }
  // close modal
  function closeModal() {
    setOpen(false)
  }
  // don't submit on default
  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <>
      {/* once add folder icon is clicked open modal */}
      <IconButton onClick={openModal} variant="outline-success" size="sm">
        <CreateNewFolderIcon />
      </IconButton>
      {/* MODAL  */}
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              {/* User input to enter name of folder */}
              <Form.Label>Folder Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {/* Buttons at bottom of modal */}
            <Button variant="danger" onClick={closeModal}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={createNewFolder}>
              Add Folder
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}