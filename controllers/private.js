const Contacts = require("../models/Contacts");
const searchLogs = require("../models/Logs");
const pool = require('../config/pg');

exports.searchPostgreSQL = async (req, res) => {
    try{
        const {searchTerm, searchQuery} = req.body;
        let searchTermNew = searchTerm + '%'
        if (searchQuery === "firstname") {
            const contacts = await pool.query("SELECT * FROM contact_data WHERE firstname LIKE $1", [searchTermNew]);
            res.json(contacts)        
        } if (searchQuery === "lastname") {
            const contacts = await pool.query("SELECT * FROM contact_data WHERE lastname LIKE $1", [searchTermNew]);
            res.json(contacts)             
        } if (searchQuery === "email") {
            const contacts = await pool.query("SELECT * FROM contact_data WHERE email LIKE $1", [searchTermNew]);
            res.json(contacts)
        } if (searchQuery === "phone") {
            const contacts = await pool.query("SELECT * FROM contact_data WHERE phone LIKE $1", [searchTermNew]);
            res.json(contacts) 
        } if (searchQuery === "streetaddress") {
            const contacts = await pool.query("SELECT * FROM contact_data WHERE streetaddress LIKE $1", [searchTermNew]);
            res.json(contacts)
        }
    }catch(err){
        console.error(err.message)
    }
}

exports.searchMongoDB = async (req, res) => {
    try{
        const {searchQuery, searchTerm} = req.body; 
        if (searchQuery === "firstname") {
            const contact = await Contacts.find({firstname: {$regex: searchTerm}})
            res.json(contact)          
        } if (searchQuery === "lastname") {
            const contact = await Contacts.find({lastname: {$regex: searchTerm}})
            res.json(contact)               
        } if (searchQuery === "email") {
            const contact = await Contacts.find({email: {$regex: searchTerm}})
            res.json(contact)  
        } if (searchQuery === "phone") {
            const contact = await Contacts.find({email: {$regex: searchTerm}})
            res.json(contact)  
        } if (searchQuery === "streetaddress") {
            const contact = await Contacts.find({streetaddress: {$regex: searchTerm}})
            res.json(contact)
        }
     } catch (err) {
        console.error(err.message)
    }
}

exports.logSearches = async (req, res)=> {
    try {
        const logSearch = new searchLogs({username: req.body.user, searchTerm: req.body.searchTerm, database: req.body.database, searchQuery: req.body.searchQuery})
        res.json(logSearch)
        await logSearch.save()
    } catch (err) {
        console.error(err)
    }
}

exports.getAllLogs = async (req, res)=> {
    try{
        let allLogs = await searchLogs.find()
        res.json(allLogs)
    } catch (err) {
        console.error(err)
    }
}
