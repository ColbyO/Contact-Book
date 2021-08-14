import React, {useState, useEffect} from 'react'
import {IconButton} from '@material-ui/core'
import {DataGrid} from '@material-ui/data-grid'
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


function ListSearches({searchTerm}) {
    const [tableData, setTableData] = useState([])
    const [selectionModel, setSelectionModel] = useState([])
    const [view, setView] = useState('list');
    const [edit, setEdit] = useState(false);

    const handleChange = (event, nextView) => {
      setView(nextView);
    };
    const editBtn = () => {
        if(edit === true){
            setEdit(false)
        } else {
            setEdit(true)
        }
        console.log(selectionModel)
    }
    const columns = [
        {field: 'firstname', headerName: "First Name", width: 150},
        {field: 'lastname', headerName: "Last Name", width: 150},
        {field: 'company', headerName: "Company", width: 250},
        {field: 'department', headerName: "Department", width: 250},
        {field: 'jobtitle', headerName: "Job Title", width: 250},
        {field: 'email', headerName: "Email", width: 250},
        {field: 'phone', headerName: "Phone", width: 150},

    ]

    useEffect(()=>{
        setTableData(searchTerm)
    })

    return (
        <Container>

            {searchTerm ? 
            <div>
                <div style={{display: "flex"}}>
                    <ToggleButtonGroup orientation="horizontal" value={view} exclusive onChange={handleChange}>
                        <ToggleButton value="list" aria-label="list">
                            <ViewListIcon />
                        </ToggleButton>
                        <ToggleButton value="module" aria-label="module">
                            <ViewModuleIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                    {
                        selectionModel.length < 1 ?
                        <ButtonGroup style={{alignItems: "flex-end"}}>
                        <IconButton aria-label="Add">
                            <AddIcon />
                        </IconButton>
                        </ButtonGroup> : <></>
                    }
                    {
                        selectionModel.length === 1 ? 
                        <ButtonGroup>
                            <IconButton aria-label="Edit">
                                <EditIcon onClick={editBtn} />
                            </IconButton>
                            <IconButton aria-label="Delete">
                                <DeleteIcon />
                            </IconButton>
                        </ButtonGroup>   
                       
                        : <></>
                    }
                    {
                        selectionModel.length > 1 ? 
                        <ButtonGroup>
                            <IconButton aria-label="Delete">
                                <DeleteIcon />
                            </IconButton>
                        </ButtonGroup>                           
                        : <></>
                    }
                    {
                        edit ? <EditModal view={edit} profile={selectionModel} /> : <></>
                    }
                </div>
                <div style={{height: 650, width: '100%', marginTop: "15px"}}>
                    <DataGrid
                    rows={tableData}
                    columns={columns}
                    pageSize={10}
                    checkboxSelection
                    onRowClick={(e)=> console.log(e.row)}
                    onSelectionModelChange={(newSelectionModel)=> {
                        setSelectionModel(newSelectionModel)
                    }}
                    selectionModel={selectionModel}
                    /> </div> </div> : <p></p>    
            }
        
            </Container>
    )
}

export default ListSearches