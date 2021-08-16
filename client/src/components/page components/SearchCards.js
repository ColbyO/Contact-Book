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
    const [tableData, setTableData] = useState([])
    const [modalInfo, setModalInfo] = useState([]);
    const [selectModal, setselectModal] = useState([]);
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
    },[])

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

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = tableData.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px"}}>
        {
            currentPosts.map(keyWord => 
                <div style={{height: "250px"}}>
                <Paper style={{width: "300px", height: "200px"}} key={keyWord.id} >
                <div style={{marginLeft: "68%", marginTop: "2%"}}>
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
                            </ButtonGroup> 
                            </div>
                <Avatar style={{marginLeft: "20%", marginTop: "-35px", backgroundColor: "orange", color: "black"}}>T</Avatar>
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
        <Pagination 
        postsPerPage={postsPerPage}
        totalPosts={tableData.length}
        paginate={paginate}
        
      />
      </div>
      {
          openModal ? <div > <CardModal view={openModal} info={modalInfo} close={closeModalHandler} /> </div> : <p></p>
      }
      {
          edit ? <div ><EditModal view={edit} close={closeModalHandler} profile={modalInfo} /></div>  : <p></p>
      }
        </div>
    )
}

export default SearchCards
