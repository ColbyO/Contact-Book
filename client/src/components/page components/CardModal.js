import React, { useState } from 'react'
import { Button, Card} from "react-bootstrap"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Avatar from '@material-ui/core/Avatar';

// styling for modal
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

// view = open modal | info = contact info | close = close modal
function CardModal({view, info, close}) {
    // import styling
    const classes = useStyles();
    // use state for opening modal
    const [open] = useState(view);
  
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
          {/* Modal fade-in */}
          <Fade in={open}>
          <Card style={{width: "35%"}}>
          <Card.Body>
            {/* Full name of contact at the top of the modal */}
            <h2 className="text-center mb-4">{info.firstname + " " + info.lastname}</h2>
            {/* Avatar with initial of first name */}
            <Avatar style={{marginLeft: "46%"}} variant="rounded">{info.firstname[0]}</Avatar>
            {/* All info of contact */}
              <section style={{textAlign: "center", paddingTop: "25px", marginLeft: "-15px"}}>
                <h6>Email</h6>
                <p>info.email</p>
                <h6>Phone</h6>
                <p>{info.phone}</p>
                <h6>Employer</h6>
                <p>{info.company}</p>
                <h6>Department</h6>
                <p>{info.department}</p>
                <h6>Job Title</h6>
                <p>{info.jobtitle}</p>
                </section>
                {/* Button to close modal */}
              <Button className="w-100 mt-3" onClick={close}>
                Close
              </Button>
          </Card.Body>
        </Card>
          </Fade>
        </Modal>
      </div>
    )
}

export default CardModal
