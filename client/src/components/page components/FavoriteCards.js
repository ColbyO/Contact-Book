import { Paper, Avatar, Typography, ButtonGroup, IconButton,  } from '@material-ui/core'
import axios from 'axios';
import Pagination from '../page components/Pagination';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import React, {useState, useEffect} from 'react'
import CardModal from './CardModal';
import EditModal from './EditModal'

function SearchCards({searchTerm}) {
    const [modalInfo, setModalInfo] = useState([]);
    const [selectModal, setselectModal] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [edit, setEdit] = useState(false);

    const closeModalHandler = () => {
        setOpenModal(false)
        setEdit(false)
    };

    const getContactInfo = async () => {
        let currentContact = await axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            },
            url: "http://localhost:5000/api/private/get/contact",
            data: {
                id: modalInfo.id
            }
        })
        if (currentContact.data._id) {
            setselectModal(searchTerm.data)
        } else {
            setselectModal(searchTerm.data[0])
        }

    }

    const deleteOneContact = async () => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            let deleteContact = await axios({
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                },
                url: "http://localhost:5000/api/private/delete/contact",
                data: {
                    id: selectModal.id
                }
            })
            console.log(deleteContact)
        } else {
            console.log("DIDNT DELETE")
        }
    } 

    return (
        <div>
        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px"}}>
                <div style={{height: "250px"}}>
                <Paper style={{width: "300px", height: "200px"}} key={searchTerm.id} >
                <div style={{marginLeft: "68%", marginTop: "2%"}}>
                            <ButtonGroup>
                                <IconButton aria-label="Edit" onClick={()=> {
                                        setModalInfo(searchTerm)
                                        setEdit(!edit)
                                        getContactInfo()
                                    }}  >
                                    <EditIcon/>
                                </IconButton>
                                <IconButton aria-label="Delete" onClick={async ()=> {
                                        await getContactInfo()
                                        deleteOneContact()
                                    }} >
                                    <DeleteIcon />
                                </IconButton>
                            </ButtonGroup> 
                            </div>
                <Avatar style={{marginLeft: "20%", marginTop: "-35px", backgroundColor: "orange", color: "black"}}>T</Avatar>
                <Typography align="left" variant="h5" style={{marginLeft: "10%", marginTop: "10px"}} >{searchTerm.firstname + " " + searchTerm.lastname}</Typography>
                <Typography align="left" variant="h6" style={{marginLeft: "10%"}}>{searchTerm.department}</Typography>
                <Typography align="left" variant="subtitle1" style={{marginLeft: "10%"}}>{searchTerm.company}</Typography>
                <Typography align="left" variant="subtitle2" style={{marginLeft: "10%"}}>{searchTerm.jobtitle}</Typography>
                <IconButton style={{marginLeft: "83%", marginTop: "-12%"}}>
                    <OpenInNewIcon onClick={()=> {
                    setModalInfo(searchTerm)
                    setOpenModal(!openModal)
                    }}  />
                </IconButton>
            </Paper>
            </div>
                
        <div>

      </div>

      {
          openModal ? <div > <CardModal view={openModal} info={modalInfo} close={closeModalHandler} /> </div> : <p></p>
      }
      {
          edit ? <div ><EditModal view={edit} close={closeModalHandler} profile={modalInfo} /></div>  : <p></p>
      }
      </div>
        </div>
    )
}

export default SearchCards
