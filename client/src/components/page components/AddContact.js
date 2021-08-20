import React, {useState, useEffect} from 'react'
import { Form, Button, Card, Dropdown, DropdownButton} from "react-bootstrap"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import axios from 'axios';

// Modal Styling
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

function AddContact({open, close}) {
  // importing styles
    const classes = useStyles();
  // check if database is selected
    const [database, setDatabase] = useState("Database")
  // save length of all id's so theres no overlap ids
    const [id, setLength] = useState()
  // usestates for saving adding user input from form
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [company, setCompany] = useState("")
    const [department, setDepartment] = useState("")
    const [jobTitle, setJobTitle] = useState("")

    const getAllContactsLength = async () => {
      // saving headers 
        const config = {
            headers: {
                "Content-Type": "application/json",
                // important for allowing user to fetch
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            }
        }
        // two post requests for both databases to get every item in each database
            await axios.all([
                axios.post("/api/private/search/postgresql", {
                        searchTerm: "",
                        searchQuery: "firstname"
                    }, config),
                axios.post("/api/private/search/mongodb", {
                        searchTerm: "",
                        searchQuery: "firstname"
                    }, config),
            ]).then(axios.spread((data1, data2)=> {
                // combines both array's
                Array.prototype.push.apply(data1.data.rows, data2.data);
                // sets the length of both arrays
                setLength(data1.data.rows.length)
            }))
    }
    // on run get all contacts length
    useEffect(()=> {
        getAllContactsLength()
    },[])

    const addContactFunc = async () => {
      // if no database is selected dont run the fetch request
        if (database === "Database") {
            alert("No database selected")
        } else {
          // post request to add contact to database
            let addContact = await axios({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                },
                url: "http://localhost:5000/api/private/add/contact",
                data: {
                    database: database,
                    id: id + 1,
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    phone: phone,
                    company: company,
                    department: department,
                    jobtitle: jobTitle
                }
            })
            // if post request is successful go back to home page.
            if (addContact === "INSERT"){
                window.location = "/"
            } else {
                // do nothing
            }

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
        {/* Modal Fade in */}
        <Fade in={open}>
        <Card style={{width: "35%"}}>
        <Card.Body>
          {/* Title on top of Modal */}
          <h2 className="text-center mb-4">Add Contact</h2>
          <Form >
            {/************** FIRST NAME INPUT **************/}
            <Form.Group id="firstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control onChange={(e)=> setFirstname(e.target.value)} required/>
            </Form.Group>
            {/************** LAST NAME INPUT **************/}              
            <Form.Group id="lastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control onChange={(e)=> setLastname(e.target.value)} required/>
            </Form.Group>
            {/************** EMAIL INPUT **************/}
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control onChange={(e)=> setEmail(e.target.value)} required/>
            </Form.Group>
            {/************** PHONE INPUT **************/}
            <Form.Group id="phone">
              <Form.Label>Phone</Form.Label><br></br>
              <Form.Control onChange={(e)=> setPhone(e.target.value)} required/>
            </Form.Group>
            {/************** COMPANY INPUT **************/}
            <Form.Group id="company">
              <Form.Label>Employer</Form.Label>
              <Form.Control onChange={(e)=> setCompany(e.target.value)} required/>
            </Form.Group>
            {/************** DEPARTMENT INPUT **************/}
            <Form.Group id="department">
              <Form.Label>Department</Form.Label>
              <Form.Control onChange={(e)=> setDepartment(e.target.value)} required/>
            </Form.Group>
            {/************** JOBTITLE INPUT **************/}
            <Form.Group id="jobtitle">
              <Form.Label>Job Title</Form.Label>
              <Form.Control onChange={(e)=> setJobTitle(e.target.value)} required/>
            </Form.Group>
            {/************** CHOOSE DATABASE INPUT **************/}
            <DropdownButton
            variant="outline-secondary"
            title={database}
            id="input-group-dropdown-1"
            >
            <Dropdown.Item href="#" onClick={() => setDatabase("PostgreSQL")}>PostgreSQL</Dropdown.Item>
            <Dropdown.Item href="#" onClick={() => setDatabase("MongoDB")}>MongoDB</Dropdown.Item>
            </DropdownButton>
            {/************** BUTTONS **************/}
            <Button className="w-100 mt-3" onClick={addContactFunc}>
              Add Contact
            </Button>
            <Button className="w-100 mt-3" onClick={close}>
              Close
            </Button>
          </Form>
        </Card.Body>
      </Card>
        </Fade>
      </Modal>
    </div>
    )
}

export default AddContact
