import React,{useState, useEffect} from 'react'
import {DataGrid} from '@material-ui/data-grid'
import {Container} from 'react-bootstrap';

// Data Grid for logs of what user searched.

function ListLogs({Logs}) {
    const [logData, setLogData] = useState([])

    // grid columns
    const columns = [
        {field: 'username', headerName: "User", width: 150},
        {field: 'searchTerm', headerName: "Search Input", width: 170},
        {field: 'searchQuery', headerName: "Search Filter", width: 200},
        {field: 'database', headerName: "Database", width: 150},
        {field: 'createdAt', headerName: "Date Searched", width: 200},
    ]
    // set all of the log data
    useEffect(()=>{
        setLogData(Logs)
    }, [Logs])

    return (
        // Grid itself
        <Container>
            {Logs ? 
            <div>
                <div style={{height: 640, width: '100%', marginTop: "15px"}}>
                    <DataGrid
                    rows={logData}
                    columns={columns}
                    getRowId={(row) => row._id}
                    pageSize={10}
                    /> </div> </div> : <p></p>    
            }
            </Container>
    )
}

export default ListLogs
