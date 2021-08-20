// PAGE FOR ALL SEARCH LOGS
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import ListLogs from '../page components/ListLogs';
import NavBar from '../page components/NavBar';

function History() {
    const [Logs, setLogs] = useState()
    const [user] = useState("")

    // gets all logs and saves data on state
    async function getAllLogs() {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            }
        }
        await axios.post("/api/private/logs",{
            user: user,
            withCredentials: true,
        },config).then((res)=>{
            setLogs(res.data)
            })
    }
    // run function on launch
    useEffect(()=> {
        getAllLogs()
    })


    return (
        <div>
            <NavBar/>
            {/* Datagrid for all logs */}
            {
                Logs ? <ListLogs Logs={Logs}/> : <h1>No Logs</h1>
            }
        </div>
    )
}

export default History
