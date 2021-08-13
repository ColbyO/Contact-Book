const mongoose = require('mongoose');

const searchLogs = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    searchTerm: {
        type: String, 
        required: true
    },
    searchQuery: {
        type: String,
        required: true
    },
    database: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('searchLogs', searchLogs)