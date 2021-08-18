import React, {useState} from 'react';
import axios from 'axios';
import { Form, Button, Card} from "react-bootstrap"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function EditModal({view, profile, close}) {
  const classes = useStyles();
  const [open] = useState(view);
  const [btnName, setBtnName] = useState("Edit");
  const [edit, setEdit] = useState(true)
  
  const [updatedFirstname, setFirstname] = useState(profile.firstname)
  const [updatedLastname, setLastname] = useState(profile.lastname)
  const [updatedEmail, setEmail] = useState(profile.email)
  const [updatedPhone, setPhone] = useState(profile.phone)
  const [updatedCompany, setCompany] = useState(profile.company)
  const [updatedDepartment, setDepartment] = useState(profile.department)
  const [updatedJobTitle, setJobTitle] = useState(profile.jobtitle)

  const editForm = () => {
    if (edit === false) {
        setEdit(true)
    } else {
        setEdit(false)
        setBtnName("Submit")
    }
  }

  const updateContact = async () => {
    let updateContact = await axios({
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        url: "http://localhost:5000/api/private/update/contactinfo",
        data: {
            id: profile.id,
            firstname: updatedFirstname,
            lastname: updatedLastname,
            email: updatedEmail,
            phone: updatedPhone,
            company: updatedCompany,
            department: updatedDepartment,
            jobtitle: updatedJobTitle
        }
    })
    if (updateContact.data === "UPDATE") {
      alert("SUCCESSFULLY UPDATED")
    }
}

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={close}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
        <Card style={{width: "35%"}}>
        <Card.Body>
          <h2 className="text-center mb-4">Edit Contact</h2>
          <Form onSubmit={updateContact}>
            <Form.Group id="firstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control disabled={edit} value={updatedFirstname} onChange={(e)=> setFirstname(e.target.value)} required/>
            </Form.Group>              
            <Form.Group id="lastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control disabled={edit} value={updatedLastname} onChange={(e)=> setLastname(e.target.value)} required/>
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control disabled={edit} value={updatedEmail} onChange={(e)=> setEmail(e.target.value)} required/>
            </Form.Group>
            <Form.Group id="phone">
              <Form.Label>Phone</Form.Label><br></br>
              <Form.Control disabled={edit} value={updatedPhone} onChange={(e)=> setPhone(e.target.value)} required/>
            </Form.Group>
            <Form.Group id="company">
              <Form.Label>Employer</Form.Label>
              <Form.Control disabled={edit} value={updatedCompany} onChange={(e)=> setCompany(e.target.value)} required />
            </Form.Group>
            <Form.Group id="department">
              <Form.Label>Department</Form.Label>
              <Form.Control disabled={edit} value={updatedDepartment} onChange={(e)=> setDepartment(e.target.value)} required/>
            </Form.Group>
            <Form.Group id="jobtitle">
              <Form.Label>Job Title</Form.Label>
              <Form.Control disabled={edit} value={updatedJobTitle} onChange={(e)=> setJobTitle(e.target.value)} required/>
            </Form.Group>
            {
              btnName === "Edit" ?             
            <Button className="w-100 mt-3" onClick={editForm}>
              Edit
            </Button> : <p></p>
            }
            {
              btnName === "Submit" ?
            <Button className="w-100 mt-3" type="submit">
              Submit
            </Button> : <p></p>
            }
            <Button className="w-100 mt-3" onClick={close}>
              Close
            </Button>
          </Form>
        </Card.Body>
      </Card>
        </Fade>
      </Modal>
    </div>
  );
}

export default EditModal