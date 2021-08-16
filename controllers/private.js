const User = require("../models/User");
const Contacts = require("../models/Contacts");
const searchLogs = require("../models/Logs");
const pool = require('../config/pg');
const jwt = require('jsonwebtoken');

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

exports.getContactInfo = async (req, res) => {
    const contactID = req.body.id;
    try{
        const contact = await Contacts.findOne({id: contactID})
        if (contact === null) {
            const contacts = await pool.query("SELECT * FROM contact_data WHERE id = $1", [contactID]);
            res.json(contacts.rows)
        }
        if (contact !== null) {
            res.json(contact)
        }
    } catch (err) {
        console.error(err)
    }
}

exports.updateContactInfo = async (req, res) => {
    const contactID = req.body.id;
    const setFirstname = req.body.firstname;
    const setLastname = req.body.lastname;
    const setEmail = req.body.email;
    const setPhone = req.body.phone;
    const setCompany = req.body.company;
    const setDepartment = req.body.department;
    const setJobTitle = req.body.jobtitle;
    try{
        const contact = await Contacts.findOne({id: contactID})
        if (contact === null) {
            const contacts = await pool.query("UPDATE contact_data SET firstname = $1, lastname = $2, email = $3, phone = $4, company = $5, department = $6, jobtitle = $7 WHERE id = $8", [setFirstname, setLastname, setEmail, setPhone, setCompany, setDepartment, setJobTitle, contactID]);
            res.json(contacts.command) // if updated sends UPDATE
            console.log(contacts.command)
        }
        if (contact !== null) {
            const updated = await Contacts.updateOne({id: contactID}, {$set: {firstname: setFirstname, lastname: setLastname, email: setEmail, phone: setPhone, company: setCompany, department: setDepartment, jobtitle: setJobTitle}})
            console.log(updated)
        }
    } catch (err) {
        console.error(err)
    }
}

exports.deleteOneContact = async (req, res) => {
    const contactID = req.body.id;
    try{
        const contact = await Contacts.findOne({id: contactID})
        if (contact === null) {
            const contacts = await pool.query("DELETE FROM contact_data WHERE id = $1", [contactID]);
            res.json(contacts.rows)
        }
        if (contact !== null) {
            const contact = await Contacts.deleteOne({id: contactID})
            res.json(contact)
        }
    } catch (err) {
        console.error(err)
    } 
}

exports.deleteManyContacts = async (req, res) => {
    const inputId = req.body.id;
        try{
            for (i = 0 ; i < inputId.length; i++) {
                console.log(inputId[i])
                const contact = await pool.query("SELECT * FROM contact_data WHERE id = $1", [inputId[i]])
                if (contact.rows.length >= 1) {
                    const contacts = await pool.query("DELETE FROM contact_data WHERE id = $1", [inputId[i]]);
                    res.json(contacts.rows)
                } else {
                    const contact = await Contacts.deleteOne({id: inputId[i]})
                    res.json(contact)
                }
            }
        
            // if (contact === null) {
            //     const contacts = await pool.query("DELETE FROM contact_data WHERE (id)) IN ($1)", [inputId]);
            //     res.json(contacts.rows)
            //     console.log(contacts)
            // }
            // if (contact !== null) {
            //     const contact = await Contacts.deleteMany({id: { $in: inputId}})
            //     res.json(contact)
            //     console.log(contact)
            // }
        } catch (err) {
            console.error(err)
        }         
      
}

exports.addContact = async (req, res) => {
    const database = req.body.database
    const contactID = req.body.id;
    const setFirstname = req.body.firstname;
    const setLastname = req.body.lastname;
    const setEmail = req.body.email;
    const setPhone = req.body.phone;
    const setCompany = req.body.company;
    const setDepartment = req.body.department;
    const setJobTitle = req.body.jobtitle;
    try{
        console.log("Test")
        if(database === "MongoDB") {
            const newContact = new Contacts({id: contactID, firstname: setFirstname, lastname: setLastname, email: setEmail, phone: setPhone, company: setCompany, department: setDepartment, jobtitle: setJobTitle})
            console.log(newContact)
            await newContact.save()
        }
        if (database === "PostgreSQL") {
            const newContact = await pool.query("INSERT INTO contact_data (id, firstname, lastname, email, phone, company, department, jobtitle) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [contactID ,setFirstname, setLastname, setEmail, setPhone, setCompany, setDepartment, setJobTitle])
            console.log(newContact)
        }
    } catch (err) {
        console.error(err)
    }
}

exports.getCurrentUser = async (req, res) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        res.json(user)
    } catch (err) {
        console.error(err)
    }

}
