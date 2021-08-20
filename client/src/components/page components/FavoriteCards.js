import { Paper, Avatar, Typography, ButtonGroup, IconButton,  } from '@material-ui/core'
import axios from 'axios';
import { useParams } from 'react-router';
import CloseIcon from '@material-ui/icons/Close';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import React, {useState} from 'react'
import CardModal from './CardModal';
import EditModal from './EditModal'

function SearchCards({searchTerm}) {
    // array of colors for avatar icon background color to cycle through
    const classes = ["orange", "lightblue", "lightgray", "lightgreen", "lightred"]
    // get id of url thats the same as the folderid
    let { folderid } = useParams();
    // current contact info for popout more info modal
    const [modalInfo, setModalInfo] = useState([]);
    // current contact info for delete icon
    const [selectModal, setselectModal] = useState("");
    // open modal
    const [openModal, setOpenModal] = useState(false);
    // edit modal
    const [edit, setEdit] = useState(false);

    // close modal
    const closeModalHandler = () => {
        setOpenModal(false)
        setEdit(false)
    };

    // delete contact
    const deleteOneContact = async () => {
        // current modal id
        let ID = selectModal._id
        // extra security so no accidental deletion
        if (window.confirm("Are you sure you want to delete this contact?")) {
            let deleteContact = await axios({
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                },
                url: "http://localhost:5000/api/private/delete/contactfromfolder",
                data: {
                    id: ID
                }
            })
            // no errors, push to bookmarks current folder.
            if (deleteContact.data !== null) {
                window.location = `/bookmarks/${folderid}`
            }
            // if error occurred
            if (deleteContact.data === null) {
                alert("Some error has occurred")
            }
        } else {
            // another error.
            console.log("DIDNT DELETE")
        }
    } 

    return (
        <div>
        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px"}}>
                <div style={{height: "320px"}}>
                <Paper style={{width: "300px", height: "300px", boxShadow: "0px 1px 10px 1px rgba(0,0,0,0.41)", borderRadius: "15px"}} key={searchTerm.id} >
                <header style={{backgroundColor: "#0d6efd", height: "45%", borderRadius: "15px", boxShadow: "0px 15px 22px 5px rgba(0,0,0,0.1)"}}>
                            <section style={{transform: "scale(0.8)", marginTop: "2%", marginLeft: "-10%"}}>
                                {/* DELETE BUTTON */}
                            <ButtonGroup>
                                <IconButton aria-label="Delete" onClick={async ()=> {
                                    console.log(searchTerm)
                                        await setselectModal(searchTerm)
                                        deleteOneContact()
                                    }} >
                                    <CloseIcon />
                                </IconButton>
                            </ButtonGroup> 
                            </section>
                            {/* OPEN EXTRA INFO BUTTON */}
                            <IconButton style={{marginLeft: "83%", marginTop: "-25%"}}>
                                <OpenInNewIcon onClick={()=> {
                                setModalInfo(searchTerm)
                                setOpenModal(!openModal)
                                }}  />
                            </IconButton>
                            </header>
                {/* Avatar  */}
                <Avatar variant="rounded"
                style={{marginLeft: "44%", marginTop: "-35px", color: "black", transform: "scale(2.0)",backgroundColor: classes[Math.floor(Math.random() * 5)]}}>{searchTerm.firstname[0]}</Avatar>
                {/* contact info  */}
                <section style={{paddingTop: "25px"}}>
                <Typography align="left" variant="h5" style={{marginTop: "10px", textAlign: "center"}}>{searchTerm.firstname + " " + searchTerm.lastname}</Typography>
                <Typography align="left" variant="h6" style={{textAlign: "center"}}>{searchTerm.department}</Typography>
                <Typography align="left" variant="subtitle1" style={{textAlign: "center"}}>{searchTerm.company}</Typography>
                <Typography align="left" variant="subtitle2" style={{textAlign: "center"}}>{searchTerm.jobtitle}</Typography>
                </section>
            </Paper>
            </div>
                
        <div>

      </div>
      {/* Extra Contact Info Modal */}
      {
          openModal ? <div > <CardModal view={openModal} info={modalInfo} close={closeModalHandler} /> </div> : <p></p>
      }
      {/* Contact Edit Modal */}
      {
          edit ? <div ><EditModal view={edit} close={closeModalHandler} profile={modalInfo} /></div>  : <p></p>
      }
      </div>
        </div>
    )
}

export default SearchCards
