import React, {useState, useEffect} from 'react'
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
// MATERIAL UI
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
// COMPONENTS
import NavBar from '../page components/NavBar';
import AddFolder from '../page components/AddFolder';
import Folder from '../page components/Folder';
import FavoriteCards from '../page components/FavoriteCards';

function InFolder() {
    // get folderid from url
    let { folderid } = useParams();
    // usehistory for redirect
    let history = useHistory();
    // useStates
    const [user, setUser] = useState([])
    const [currentFolder, setCurrentFolder] = useState([])
    const [contents, setContents] = useState([])

    // get current user data
    const getCurrentUser = async () => {
        let currentUser = await axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            },
            url: "http://localhost:5000/api/private/get/currentuser",
        })
        setUser(currentUser.data)
    }
    // get current folder thats opened
    const getCurrentFolder = async () => {
        let getcurrentFolder = await axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            },
            url: "http://localhost:5000/api/private/get/currentfolder",
            data: {
                id: folderid
            }
        })
            setCurrentFolder(getcurrentFolder.data)
        }

    // get all the contacts related to opened folder 
    const getFolderContents = async () => {
        let folderContents = await axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            },
            url: "http://localhost:5000/api/private/get/bookmarkcontent",
            data: {
                folderID: folderid
            }
        })
        console.log(folderContents.data)
        setContents(folderContents.data)
    }

    // run functions on launch
    useEffect(()=> {
        getCurrentUser()
        getCurrentFolder()
        getFolderContents()
    }, [])

    // delete folder 
    const deleteFolder = async () => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            await axios({
                method:"DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                },
                url: "http://localhost:5000/api/private/delete/folder",
                data: {
                    id: folderid
                }
            })
            alert("Successfully deleted")
            history.goBack()
        } else {
            console.log("didnt delete")
        }
    }

    return (
        <div>
            <NavBar />
            {/* Delete Button */}
            <section style={{marginLeft: "86.9%"}}>
            <IconButton onClick={()=> deleteFolder()}>
                <DeleteIcon />
            </IconButton>
            {/* Add folder button */}
            <AddFolder currentUser={user} currentFolder={currentFolder} folderid={folderid} />
            </section>
            {/* Display folders inside folder */}
            <section style={{display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px"}} >
            {
                currentFolder.map(keyWord=> <Folder key={keyWord.id || keyWord._id} currentFolder={keyWord} />)
            }
            </section>
            {/* display contacts in folder */}
            <section style={{display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px", marginLeft: "30px", marginTop: "2%"}} >
                {
                    contents.map(keyWord => <FavoriteCards key={keyWord.id || keyWord._id} searchTerm={keyWord} />)
                }
            </section>
        </div>
    )
}

export default InFolder
