import React, {useState, useEffect} from 'react';
import axios from 'axios';
import NavBar from '../page components/NavBar';
import AddFolder from '../page components/AddFolder';
import Folder from '../page components/Folder';

function Bookmarks() {
    const [user, setUser] = useState([])
    const [currentFolder, setCurrentFolder] = useState([])

    // gets current logged in user and saves it in the state
    const getCurrentUser = async () => {
        let currentUser = await axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            },
            url: "http://localhost:5000/api/private/get/currentuser",
            data: {
                id: "1001"
            }
        })
        setUser(currentUser.data)
    }

    // run function on launch
    useEffect(() => {
        getCurrentUser()
    }, [])

    // gets all folders with parentID of ROOT to display on the page.
    const getCurrentFolder = async () => {
            let getcurrentFolder = await axios({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                },
                url: "http://localhost:5000/api/private/get/currentfolder",
                data: {
                    id: "ROOT"
                }
            })
            setCurrentFolder(getcurrentFolder.data)
    }

    // run function on launch
    useEffect(() => {
        getCurrentFolder()
    }, [])


    return (
        <div>
            <NavBar />
            {/* Add Folder Button */}
            <section style={{marginLeft: "90%"}}>
            <AddFolder currentUser={user} />
            </section>
            {/* Map through array to display all root folders */}
            <section style={{display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px"}} >
            {
                currentFolder.map(keyWord=> <Folder currentFolder={keyWord} /> )
            }
            </section>
        </div>
    )
}

export default Bookmarks
