import React, { useState } from 'react'
import { Button, Card} from "react-bootstrap"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Avatar from '@material-ui/core/Avatar';

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
            <Avatar style={{marginLeft: "46%"}}>{info.firstname[0]}</Avatar>
              <section style={{textAlign: "center", paddingTop: "25px"}}>
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
