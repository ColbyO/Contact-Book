const mongoose = require('mongoose');

const Folder = new mongoose.Schema({
    userID: { // user who created the folder
        type: String,
        required: true
    },
    folderName: {
        type: String, 
        required: true
    },
    parentID: { // the id of folder its inside of, will be ROOT if folder is not inside another
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Folders', Folder)