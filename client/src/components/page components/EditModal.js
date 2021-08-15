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
  
  const [updatedFirstname, setFirstname] = useState("")
  const [updatedLastname, setLastname] = useState("")
  const [updatedEmail, setEmail] = useState("")
  const [updatedPhone, setPhone] = useState("")
  const [updatedCompany, setCompany] = useState("")
  const [updatedDepartment, setDepartment] = useState("")
  const [updatedJobTitle, setJobTitle] = useState("")

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
          <Form >
            <Form.Group id="firstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control disabled={edit} placeholder={profile.firstname} onChange={(e)=> setFirstname(e.target.value)}/>
            </Form.Group>              
            <Form.Group id="lastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control disabled={edit} placeholder={profile.lastname} onChange={(e)=> setLastname(e.target.value)}/>
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control disabled={edit} placeholder={profile.email} onChange={(e)=> setEmail(e.target.value)}/>
            </Form.Group>
            <Form.Group id="phone">
              <Form.Label>Phone</Form.Label><br></br>
              <Form.Control disabled={edit} placeholder={profile.phone} onChange={(e)=> setPhone(e.target.value)}/>
            </Form.Group>
            <Form.Group id="company">
              <Form.Label>Employer</Form.Label>
              <Form.Control disabled={edit} placeholder={profile.company} onChange={(e)=> setCompany(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group id="department">
              <Form.Label>Department</Form.Label>
              <Form.Control disabled={edit} placeholder={profile.department} onChange={(e)=> setDepartment(e.target.value)}/>
            </Form.Group>
            <Form.Group id="jobtitle">
              <Form.Label>Job Title</Form.Label>
              <Form.Control disabled={edit} placeholder={profile.jobtitle} onChange={(e)=> setJobTitle(e.target.value)}/>
            </Form.Group>
            {
              btnName === "Edit" ?             
            <Button className="w-100 mt-3" onClick={editForm}>
              Edit
            </Button> : <p></p>
            }
            {
              btnName === "Submit" ?
            <Button className="w-100 mt-3" onClick={updateContact}>
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