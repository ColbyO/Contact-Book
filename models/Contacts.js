const mongoose = require('mongoose');

const contactsTemplate = new mongoose.Schema({
    id: {
        type: Number,
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

module.exports = mongoose.model('Contacts', contactsTemplate)