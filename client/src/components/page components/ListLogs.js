import React,{useState, useEffect} from 'react'
import {DataGrid} from '@material-ui/data-grid'
import {Container} from 'react-bootstrap';

function ListLogs({Logs}) {
    const [logData, setLogData] = useState([])

    const columns = [
        {field: 'username', headerName: "User", width: 150},
        {field: 'searchTerm', headerName: "Search Input", width: 170},
        {field: 'searchQuery', headerName: "Search Filter", width: 200},
        {field: 'database', headerName: "Database", width: 150},
        {field: 'createdAt', headerName: "Date Searched", width: 200},
    ]

    useEffect(()=>{
        setLogData(Logs)
    })

    return (
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
