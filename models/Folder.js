const mongoose = require('mongoose');

const Folder = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    folderName: {
        type: String, 
        required: true
    },
    parentID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Folders', Folder)