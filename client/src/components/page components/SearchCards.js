import { Paper, Avatar, Typography, ButtonGroup, IconButton,  } from '@material-ui/core'
import axios from 'axios';
import Pagination from '../page components/Pagination';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import React, {useState, useEffect} from 'react'
import CardModal from './CardModal';
import EditModal from './EditModal'
import AddFavorite from './AddFavorite'

function SearchCards({searchTerm}) {
    const classes = ["orange", "lightblue", "lightgray", "lightgreen", "lightred"]

    const [tableData, setTableData] = useState([])
    const [modalInfo, setModalInfo] = useState([]);
    const [selectModal, setselectModal] = useState([]);
    const [selectionModel, setSelectionModel] = useState([])
    const [contact123, setContacts] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const [edit, setEdit] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(8);

    const closeModalHandler = () => {
        setOpenModal(false)
        setEdit(false)
    };

    useEffect(()=>{
        setTableData(searchTerm)
    },[searchTerm])

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
            setselectModal(currentContact.data)
        } else {
            setselectModal(currentContact.data[0])
        }

    }

    // const getContact = async () => {
    //     try {
    //         let contacts = await axios({
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${localStorage.getItem("authToken")}`
    //             },
    //             url: "http://localhost:5000/api/private/get/contactbyid",
    //             data: {
    //                 id: selectModal[0]
    //             }
    //         }).then(data => {
    //             setContacts(data.data)
    //         })
    //     } catch (err) {
    //         console.error(err)
    //     }
    //     }

    //     useEffect(()=> {
    //         getContact()
    //     },[])

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
                    id: contact123.id
                }
            })
            console.log(deleteContact)
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
        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px"}}>
        {
            currentPosts.map(keyWord => 
                <div style={{height: "250px"}}>
                <Paper style={{width: "300px", height: "200px"}} key={keyWord.id} onClick={()=> setContacts(keyWord)}>
                <div style={{marginLeft: "52.5%", marginTop: "2%"}}>
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
                            </div>
                <Avatar style={{marginLeft: "20%", marginTop: "-35px", color: "black", backgroundColor: classes[Math.floor(Math.random() * 5)]}}>{keyWord.firstname[0]}</Avatar>
                <Typography align="left" variant="h5" style={{marginLeft: "10%", marginTop: "10px"}} >{keyWord.firstname + " " + keyWord.lastname}</Typography>
                <Typography align="left" variant="h6" style={{marginLeft: "10%"}}>{keyWord.department}</Typography>
                <Typography align="left" variant="subtitle1" style={{marginLeft: "10%"}}>{keyWord.company}</Typography>
                <Typography align="left" variant="subtitle2" style={{marginLeft: "10%"}}>{keyWord.jobtitle}</Typography>
                <IconButton style={{marginLeft: "83%", marginTop: "-12%"}}>
                    <OpenInNewIcon onClick={()=> {
                    setModalInfo(keyWord)
                    setOpenModal(!openModal)
                    }}  />
                </IconButton>
            </Paper>
            </div>
                )
        }
        <div>

      </div>

      {
          openModal ? <div > <CardModal view={openModal} info={modalInfo} close={closeModalHandler} /> </div> : <p></p>
      }
      {
          edit ? <div ><EditModal view={edit} close={closeModalHandler} profile={modalInfo} /></div>  : <p></p>
      }
      </div>
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
