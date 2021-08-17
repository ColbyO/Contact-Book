import React from 'react'
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import FolderIcon from '@material-ui/icons/Folder';

function Folder({currentFolder}) {
    return (
        <div>
                    <Button 
                    variant="contained"
                    color="primary"
                    startIcon={<FolderIcon/>}
                    href={`/bookmarks/${currentFolder._id}`}
                    >
                        {currentFolder.folderName}
                    </Button>

        </div>
    )
}

export default Folder
