import React, {useState} from 'react';
import axios from 'axios';
import { Form, Button, Card} from "react-bootstrap"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

// Modal styling
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
  // open modal
  const [open] = useState(view);
  // change button name from edit to submit
  const [btnName, setBtnName] = useState("Edit");
  // allow editing
  const [edit, setEdit] = useState(true)
  
  // use states for form
  const [updatedFirstname, setFirstname] = useState(profile.firstname)
  const [updatedLastname, setLastname] = useState(profile.lastname)
  const [updatedEmail, setEmail] = useState(profile.email)
  const [updatedPhone, setPhone] = useState(profile.phone)
  const [updatedCompany, setCompany] = useState(profile.company)
  const [updatedDepartment, setDepartment] = useState(profile.department)
  const [updatedJobTitle, setJobTitle] = useState(profile.jobtitle)

  // change button name to edit/submit
  const editForm = () => {
    if (edit === false) {
        setEdit(true)
    } else {
        setEdit(false)
        setBtnName("Submit")
    }
  }

  // put request to update a certain contact info
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
    // if put request was a success, alert user
    if (updateContact.data === "UPDATE") {
      alert("SUCCESSFULLY UPDATED")
    }
}

  return (
    <div>
      {/* MODAL */}
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
        {/* fade-in for modal */}
        <Fade in={open}>
        <Card style={{width: "35%"}}>
        <Card.Body>
          {/* modal title */}
          <h2 className="text-center mb-4">Edit Contact</h2>
          <Form onSubmit={updateContact}>
            {/***************** FIRST NAME INPUT  *****************/}
            <Form.Group id="firstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control disabled={edit} value={updatedFirstname} onChange={(e)=> setFirstname(e.target.value)} required/>
            </Form.Group>    
            {/***************** LAST NAME INPUT  *****************/}          
            <Form.Group id="lastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control disabled={edit} value={updatedLastname} onChange={(e)=> setLastname(e.target.value)} required/>
            </Form.Group>
            {/***************** EMAIL INPUT  *****************/}  
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control disabled={edit} value={updatedEmail} onChange={(e)=> setEmail(e.target.value)} required/>
            </Form.Group>
            {/***************** PHONE INPUT  *****************/}
            <Form.Group id="phone">
              <Form.Label>Phone</Form.Label><br></br>
              <Form.Control disabled={edit} value={updatedPhone} onChange={(e)=> setPhone(e.target.value)} required/>
            </Form.Group>
            {/***************** COMPANY INPUT  *****************/}
            <Form.Group id="company">
              <Form.Label>Employer</Form.Label>
              <Form.Control disabled={edit} value={updatedCompany} onChange={(e)=> setCompany(e.target.value)} required />
            </Form.Group>
            {/***************** DEPARTMENT INPUT  *****************/}
            <Form.Group id="department">
              <Form.Label>Department</Form.Label>
              <Form.Control disabled={edit} value={updatedDepartment} onChange={(e)=> setDepartment(e.target.value)} required/>
            </Form.Group>
            {/***************** JOB TITLE INPUT  *****************/}
            <Form.Group id="jobtitle">
              <Form.Label>Job Title</Form.Label>
              <Form.Control disabled={edit} value={updatedJobTitle} onChange={(e)=> setJobTitle(e.target.value)} required/>
            </Form.Group>
            {/* if button name is edit, edit button */}
            {
              btnName === "Edit" ?             
            <Button className="w-100 mt-3" onClick={editForm}>
              Edit
            </Button> : <p></p>
            }
            {/* if button name is submit, submit button */}
            {
              btnName === "Submit" ?
            <Button className="w-100 mt-3" type="submit">
              Submit
            </Button> : <p></p>
            }
            {/* Close button */}
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