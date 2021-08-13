const mongoose = require('mongoose');

const contactsTemplate = new mongoose.Schema({
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
    street_address: {
        type: String, 
        required: true
    },
    phone: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Contacts', contactsTemplate)