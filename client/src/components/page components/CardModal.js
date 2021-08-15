import React, { useState } from 'react'
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

function CardModal({view, info, close}) {
    const classes = useStyles();
    const [open] = useState(view);
  
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
            <h2 className="text-center mb-4">{info.firstname + " " + info.lastname}</h2>
            <Form >
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control placeholder={info.email}/>
              </Form.Group>              
              <Form.Group id="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control placeholder={info.phone}/>
              </Form.Group>
              <Form.Group id="company">
                <Form.Label>Employer</Form.Label><br></br>
                <Form.Control placeholder={info.company}/>
              </Form.Group>
              <Form.Group id="deparment">
                <Form.Label>Department</Form.Label>
                <Form.Control placeholder={info.department}/>
              </Form.Group>
              <Form.Group id="jobtitle">
                <Form.Label>Job Title</Form.Label>
                <Form.Control placeholder={info.jobtitle}/>
              </Form.Group>
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

export default CardModal
