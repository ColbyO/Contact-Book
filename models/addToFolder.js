const mongoose = require('mongoose');

const addToFolder = new mongoose.Schema({
    contactID: {
        type: String,
        required: true
    },
    folderID: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    jobtitle: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('addToFolder', addToFolder)