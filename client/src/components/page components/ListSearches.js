import React, {useState, useEffect} from 'react'
import {DataGrid} from '@material-ui/data-grid'
import {Container} from 'react-bootstrap';
import ViewListIcon from '@material-ui/icons/ViewList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


function ListSearches({searchTerm}) {
    const [tableData, setTableData] = useState([])
    const [view, setView] = useState('list');

    const handleChange = (event, nextView) => {
      setView(nextView);
    };
    const columns = [
        {field: 'firstname', headerName: "First Name", width: 150},
        {field: 'lastname', headerName: "Last Name", width: 150},
        {field: 'email', headerName: "Email", width: 250},
        {field: 'phone', headerName: "Phone", width: 150},
        {field: 'streetaddress', headerName: "Street Address", width: 200},
    ]

    useEffect(()=>{
        setTableData(searchTerm)
    })

    return (
        <Container>

            {searchTerm ? 
            <div>
                <div>
                    <ToggleButtonGroup orientation="horizontal" value={view} exclusive onChange={handleChange}>
                        <ToggleButton value="list" aria-label="list">
                            <ViewListIcon />
                        </ToggleButton>
                        <ToggleButton value="module" aria-label="module">
                            <ViewModuleIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div style={{height: 640, width: '100%', marginTop: "15px"}}>
                    <DataGrid
                    rows={tableData}
                    columns={columns}
                    pageSize={10}
                    checkboxSelection
                    disableSelectionOnClick
                    /> </div> </div> : <p></p>    
            }
        
            </Container>
    )
}

export default ListSearches