import React, {useState, useEffect} from 'react'
import axios from 'axios';
import {IconButton} from '@material-ui/core';
import {DataGrid} from '@material-ui/data-grid';
import {Container} from 'react-bootstrap';
import ViewListIcon from '@material-ui/icons/ViewList';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import EditModal from './EditModal'
import SearchCards from './SearchCards';
import AddContact from './AddContact';
import AddFavorite from './AddFavorite'


function ListSearches({searchTerm}) {
    const [tableData, setTableData] = useState([])
    const [selectionModel, setSelectionModel] = useState([])
    const [editInfo, setEditInfo] = useState([])
    // const [allFolders, setAllFolders] = useState([])
    const [contact123, setContacts] = useState([])
    const [viewAddModal, setViewAddModal] = useState(false)
    const [view, setView] = useState('module');
    const [edit, setEdit] = useState(false);

    const getContactInfo = async () => {
        let id = selectionModel[0]
        let currentContact = await axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            },
            url: "http://localhost:5000/api/private/get/contact",
            data: {
                id: id
            }
        })
        if (currentContact.data._id) {
            setEditInfo(currentContact.data)
        } else {
            setEditInfo(currentContact.data[0])
        }

    }

    const handleViewChange = (event, nextView) => {
        if(view === "module"){
            setView("list")
        } else {
            setView("module")
        }
    };

    const closeModalHandler = () => {
        setEdit(false)
        setViewAddModal(false)
    };

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
                    id: selectionModel[0]
                }
            })
            if (deleteContact.status === 200) {
                window.location = "/"
            } else {
                alert("DIDNT DELETE")
            }
        } else {
            console.log("DIDNT DELETE")
        }
    } 

    const deleteManyContacts = async () => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            let deleteContact = await axios({
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                },
                url: "http://localhost:5000/api/private/delete/contacts",
                data: {
                    id: selectionModel
                }
            })
            if (deleteContact.status === 200) {
                window.location = "/"
            } else {
                alert("DIDNT DELETE")
            }
        } else {
            console.log("DIDNT DELETE")
        }        
    }

    const getContact = async () => {
        let contactsArray = []
        if (selectionModel.length >= 2) {
            try {
                for (let i = 0 ; i < selectionModel.length; i++) {
                    await axios({
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`
                        },
                        url: "http://localhost:5000/api/private/get/multiplecontactsbyid",
                        data: {
                            id: selectionModel[i]
                        }
                    }).then(data => {
                        contactsArray.push(data.data)
                        setContacts(contactsArray)
                    })                   
                }

            } catch (err) {
                console.error(err)
            }
        
        } else {
            try {
                await axios({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    },
                    url: "http://localhost:5000/api/private/get/contactbyid",
                    data: {
                        id: selectionModel
                    }
                }).then(data => {
                    setContacts(data.data)
                })
            } catch (err) {
                console.error(err)
            }
        }

    }
    
    useEffect(()=> {
        getContact()
    },[selectionModel])


    const columns = [
        {field: 'firstname', headerName: "First Name", width: 150, headerClassName: 'super-app-theme--header'},
        {field: 'lastname', headerName: "Last Name", width: 150},
        {field: 'company', headerName: "Company", width: 250},
        {field: 'department', headerName: "Department", width: 250},
        {field: 'jobtitle', headerName: "Job Title", width: 250},
        {field: 'email', headerName: "Email", width: 250},
        {field: 'phone', headerName: "Phone", width: 150},

    ]

    useEffect(()=>{
        setTableData(searchTerm)
    }, [searchTerm])

    return (
        <Container>

            {searchTerm ? 
            <div>
                <div style={{display: "flex"}}>
                    <ToggleButtonGroup orientation="horizontal" value={view} exclusive onChange={handleViewChange}>
                    <ToggleButton value="module" aria-label="module">
                            <ViewModuleIcon />
                        </ToggleButton>
                        <ToggleButton value="list" aria-label="list">
                            <ViewListIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>

                        <ButtonGroup style={{marginLeft: "89.8%"}}>
                        <IconButton aria-label="Add" onClick={()=> {
                            setViewAddModal(!viewAddModal)
                        }}>
                            <AddIcon />
                        </IconButton>
                        </ButtonGroup>
                    
                    {
                        selectionModel.length === 1 && view === "list" ? 
                        <ButtonGroup style={{marginLeft: "-17%"}}>
                            <AddFavorite currentContact={selectionModel} contacts={contact123}  />
                            <IconButton aria-label="Edit" onClick={()=>{
                                     setEdit(!edit)
                                     getContactInfo()
                                    }}>
                                <EditIcon />
                            </IconButton>
                            <IconButton aria-label="Delete" onClick={()=>{
                                deleteOneContact()
                            }}>
                                <DeleteIcon />
                            </IconButton>
                        </ButtonGroup>   
                       
                        : <></>
                    }
                    {
                        selectionModel.length > 1 && view === "list" ? 
                        <ButtonGroup style={{marginLeft: "-12.7%"}}>
                            <AddFavorite currentContact={selectionModel} contacts={contact123}  />
                            <IconButton aria-label="Delete" onClick={()=> {
                                deleteManyContacts()
                            }}>
                                <DeleteIcon />
                            </IconButton>
                        </ButtonGroup>                           
                        : <></>
                    }
                    {
                        edit ? <EditModal view={edit} profile={editInfo} close={closeModalHandler} /> : <></>
                    }
                    {
                        viewAddModal ? <AddContact open={viewAddModal} close={closeModalHandler} /> : <p></p>
                    }
                </div>
                {
                    view === "list" ? 
                    <div style={{height: 650, width: '100%', marginTop: "15px"}} >
                    <DataGrid
                    style={{backgroundColor: "white"}}
                    rows={tableData}
                    columns={columns}
                    pageSize={10}
                    checkboxSelection
                    // onRowClick={(e)=> console.log(e.row)}
                    onSelectionModelChange={(newSelectionModel)=> {
                        setSelectionModel(newSelectionModel)
                    }}
                    selectionModel={selectionModel}
                    /> </div>
                    : <p></p>
                }
                {
                    view === "module" ? <SearchCards searchTerm={searchTerm} /> : <p></p>
                }
             </div> : <p></p>    
            }

        
            </Container>
    )
}

export default ListSearches