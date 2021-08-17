import React, { useState } from "react";
import axios from 'axios';
import { Button, Modal, Form } from "react-bootstrap";
import {IconButton} from '@material-ui/core';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';

export default function AddFolderButton({ currentUser, folderid }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")

  const createNewFolder = async () => {
      let newFolder = await axios({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        url: "http://localhost:5000/api/private/add/folder",
        data: {
            folderName: name,
            id: currentUser._id,
            parentID: folderid || "ROOT"
        }
      })
      window.location = `/bookmarks/${newFolder.data._id}`
    console.log(folderid)
  }

  function openModal() {
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <>
      <IconButton onClick={openModal} variant="outline-success" size="sm">
        <CreateNewFolderIcon />
      </IconButton>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
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
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit" onClick={createNewFolder}>
              Add Folder
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}