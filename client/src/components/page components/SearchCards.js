import React, {useState, useEffect} from 'react'
import axios from 'axios';
// MATERIAL UI CORE
import { Paper, Avatar, Typography, ButtonGroup, IconButton } from '@material-ui/core'
// MATERIAL UI ICONS
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
// PAGE COMPONENTS
import CardModal from './CardModal';
import EditModal from './EditModal'
import AddFavorite from './AddFavorite'
import Pagination from '../page components/Pagination';

function SearchCards({searchTerm}) {
    // array of colors for avatar
    const classes = ["orange", "lightblue", "lightgray", "lightgreen", "lightred"]

    // Set Contact array for modals & functions
    const [tableData, setTableData] = useState([])
    const [modalInfo, setModalInfo] = useState([]);
    const [selectModal, setselectModal] = useState([]);
    const [contact123, setContacts] = useState([])
    // Modals
    const [openModal, setOpenModal] = useState(false);
    const [edit, setEdit] = useState(false);
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);

    const closeModalHandler = () => {
        setOpenModal(false)
        setEdit(false)
    };

    useEffect(()=>{
        setTableData(searchTerm)
    },[searchTerm])

    // get current contact info of selected contact card
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
        // if ._id must be mongodb, else must be postgresql
        if (currentContact.data._id) {
            setselectModal(currentContact.data)
        } else {
            setselectModal(currentContact.data[0])
        }

    }
    // delete contact
    const deleteOneContact = async () => {
        // confirm window
        if (window.confirm("Are you sure you want to delete this contact?")) {
            let deleteContact = await axios({
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                },
                url: "http://localhost:5000/api/private/delete/contact",
                data: {
                    id: contact123.id
                }
            })
            window.location="/"
        } else {
            console.log("DIDNT DELETE")
        }
    } 

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = tableData.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
        <div style={{display: "flex", flexWrap: "wrap", alignItems: "center", gap: "25px", marginLeft: "11%"}}>
            {/* Map through searched contacts */}
        {
            currentPosts.map(keyWord => 
                <div style={{height: "320px"}}>
                <Paper style={{width: "300px", height: "300px", boxShadow: "0px 1px 10px 1px rgba(0,0,0,0.41)", borderRadius: "15px"}} key={keyWord.id} onClick={()=> setContacts(keyWord)}>
                    <header style={{backgroundColor: "#0d6efd", height: "45%", borderRadius: "15px", boxShadow: "0px 15px 22px 5px rgba(0,0,0,0.1)"}}>
                    <section style={{transform: "scale(0.8)", marginTop: "2%", marginLeft: "-10%"}}>
                        {/* Edit and Delete Buttons */}
                            <ButtonGroup>
                                <IconButton aria-label="Edit" onClick={()=> {
                                        setModalInfo(keyWord)
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
                                <AddFavorite currentContact={contact123.id} contacts={contact123}/>
                            </ButtonGroup> 
                        </section>
                        <section style={{marginLeft: "83%", marginTop: "-16%"}}>
                            {/* Expand info button */}
                        <IconButton>
                            <OpenInNewIcon onClick={()=> {
                            setModalInfo(keyWord)
                            setOpenModal(!openModal)
                            }}  />
                        </IconButton>
                        </section>
                    </header>
                {/* Avatar */}
                <Avatar variant="rounded"
                style={{marginLeft: "44%", 
                marginTop: "-35px", 
                color: "black",
                transform: "scale(2.0)", 
                // search through and randomly pick color from array
                backgroundColor: classes[Math.floor(Math.random() * 5)]}}>{keyWord.firstname[0]}</Avatar>
                {/* Contact info */}
                <section style={{paddingTop: "25px"}}>
                <Typography align="left" variant="h5" style={{marginTop: "10px", textAlign: "center"}} >{keyWord.firstname + " " + keyWord.lastname}</Typography>
                <Typography align="left" variant="h6" style={{textAlign: "center"}}>{keyWord.department}</Typography>
                <Typography align="left" variant="subtitle1" style={{textAlign: "center"}}>{keyWord.company}</Typography>
                <Typography align="left" variant="subtitle2" style={{textAlign: "center"}}>{keyWord.jobtitle}</Typography>
                </section>

            </Paper>
            </div>
                )
        }
        <div>

      </div>
        {/* Expand Info Modal */}
      {
          openModal ? <div > <CardModal view={openModal} info={modalInfo} close={closeModalHandler} /> </div> : <p></p>
      }
      {/* Edit Modal */}
      {
          edit ? <div ><EditModal view={edit} close={closeModalHandler} profile={modalInfo} /></div>  : <p></p>
      }
      </div>
      {/* Pagination numbers at the bottom */}
      <div style={{marginLeft: "35%"}}>
      <Pagination 
        postsPerPage={postsPerPage}
        totalPosts={tableData.length}
        paginate={paginate}

      />
      </div>
        </div>
    )
}

export default SearchCards
