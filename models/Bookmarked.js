const mongoose = require('mongoose');

const Bookmarked = new mongoose.Schema({
    folderID: {
        type: String,
        required: true
    },
    id: {
        type: String, 
        required: true
    }
})

module.exports = mongoose.model('folders', Bookmarked)