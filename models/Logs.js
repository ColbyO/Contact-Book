const mongoose = require('mongoose');

const searchLogs = new mongoose.Schema({
    username: { // username of user who searched
        type: String,
        required: true
    },
    searchTerm: { // what the user searched
        type: String, 
        required: true
    },
    searchQuery: { // what the user filtered by
        type: String,
        required: true
    },
    database: { // what database the user searched
        type: String,
        required: true
    },
    createdAt: { // time that user searched
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('searchLogs', searchLogs)