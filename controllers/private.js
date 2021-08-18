const User = require("../models/User");
const Contacts = require("../models/Contacts");
const searchLogs = require("../models/Logs");
const Folder = require("../models/Folder");
const Bookmarked = require("../models/Bookmarked");
const addToFolder = require("../models/addToFolder");
const pool = require('../config/pg');
const sanitize = require('mongo-sanitize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
        } if (searchQuery === "jobtitle") {
            const contacts = await pool.query("SELECT * FROM contact_data WHERE jobtitle LIKE $1", [searchTermNew]);
            res.json(contacts)
        } if (searchQuery === "department") {
            const contacts = await pool.query("SELECT * FROM contact_data WHERE department LIKE $1", [searchTermNew]);
            res.json(contacts)
        } if (searchQuery === "company") {
            const contacts = await pool.query("SELECT * FROM contact_data WHERE company LIKE $1", [searchTermNew]);
            res.json(contacts)
        }
    }catch(err){
        console.error(err.message)
    }
}

exports.searchMongoDB = async (req, res) => {
    try{
        const {searchQuery, searchTerm} = sanitize(req.body); 
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
        } if (searchQuery === "jobtitle") {
            const contact = await Contacts.find({jobtitle: {$regex: searchTerm}})
            res.json(contact)
        } if (searchQuery === "department") {
            const contact = await Contacts.find({department: {$regex: searchTerm}})
            res.json(contact)
        } if (searchQuery === "company") {
            const contact = await Contacts.find({company: {$regex: searchTerm}})
            res.json(contact)
        }
     } catch (err) {
        console.error(err.message)
    }
}

exports.logSearches = async (req, res)=> {
    try {
        const logSearch = new searchLogs({username: sanitize(req.body.user), searchTerm: sanitize(req.body.searchTerm), database: sanitize(req.body.database), searchQuery: sanitize(req.body.searchQuery)})
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
    const contactID = sanitize(req.body.id);
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
    const contactID = sanitize(req.body.id);
    const setFirstname = sanitize(req.body.firstname);
    const setLastname = sanitize(req.body.lastname);
    const setEmail = sanitize(req.body.email);
    const setPhone = sanitize(req.body.phone);
    const setCompany = sanitize(req.body.company);
    const setDepartment = sanitize(req.body.department);
    const setJobTitle = sanitize(req.body.jobtitle);
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

exports.updateUser = async (req, res) => {
    const userID = req.body.id;
    const email = sanitize(req.body.email);
    const password = sanitize(req.body.password)
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt)
    try {
        const user = await User.updateOne({_id: userID}, { $set: {email: email, password: hashed_password }}, function(err, result){
            if(err){
                res.json(err)
            } else {
                res.json(result)
            }
        })
        res.json(user)
        console.log(user)
    } catch (err) {
        console.error(err)
    }
}

exports.deleteOneContact = async (req, res) => {
    const contactID = sanitize(req.body.id);
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
    const inputId = sanitize(req.body.id);
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
        
        } catch (err) {
            console.error(err)
        }         
      
}

exports.addContact = async (req, res) => {
    const database = sanitize(req.body.database);
    const contactID = sanitize(req.body.id);
    const setFirstname = sanitize(req.body.firstname);
    const setLastname = sanitize(req.body.lastname);
    const setEmail = sanitize(req.body.email);
    const setPhone = sanitize(req.body.phone);
    const setCompany = sanitize(req.body.company);
    const setDepartment = sanitize(req.body.department);
    const setJobTitle = sanitize(req.body.jobtitle);
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

exports.currentFolder = async (req, res) => {
    const ID = req.body.id
    try {
        let currentFolder = await Folder.find({parentID: ID})
        res.json(currentFolder)
    } catch (err) {
        console.error(err)
    }   
}

exports.allFolder = async (req, res) => {
    try {
        let currentFolder = await Folder.find()
        res.json(currentFolder)
    } catch (err) {
        console.error(err)
    }   
}

exports.createFolder = async (req, res) => {
    const ID = req.body.id
    const folderName = sanitize(req.body.folderName)
    const parentID = sanitize(req.body.parentID)
    try {
        const folder = new Folder({userID: ID, folderName: folderName, parentID: parentID})
        res.json(folder)
        await folder.save()
    } catch (err) {
        console.error(err)
    }
}

exports.deleteFolder = async (req, res) => {
    const ID = req.body.id
    try {
        const deleteF = await Folder.deleteOne({_id: ID})
        res.json(deleteF)
    } catch (err) {
        console.error(err)
    }
}

exports.addToFolder = async (req, res) => {
    const contactID = req.body.contactID
    const folderID = req.body.folderID
    const setFirstname = sanitize(req.body.firstname);
    const setLastname = sanitize(req.body.lastname);
    const setEmail = sanitize(req.body.email);
    const setPhone = sanitize(req.body.phone);
    const setCompany = sanitize(req.body.company);
    const setDepartment = sanitize(req.body.department);
    const setJobTitle = sanitize(req.body.jobtitle);
    try {
        const newFavorite = new addToFolder({contactID: contactID, folderID: folderID, firstname: setFirstname, lastname: setLastname, email: setEmail, phone: setPhone, company: setCompany, department: setDepartment, jobtitle: setJobTitle})
        res.json(newFavorite)
        await newFavorite.save()
    } catch (err) {
        console.error(err)
    }
}

exports.addManyToFolder = async (req, res) => {
    const inputId = req.body.id
    const contactID = req.body.contactID
    const folderID = req.body.folderID
    const setFirstname = sanitize(req.body.firstname);
    const setLastname = sanitize(req.body.lastname);
    const setEmail = sanitize(req.body.email);
    const setPhone = sanitize(req.body.phone);
    const setCompany = sanitize(req.body.company);
    const setDepartment = sanitize(req.body.department);
    const setJobTitle = sanitize(req.body.jobtitle);
        try{
            console.log(inputId[i])
            const newFavorite = new addToFolder({contactID: contactID, folderID: folderID, firstname: setFirstname, lastname: setLastname, email: setEmail, phone: setPhone, company: setCompany, department: setDepartment, jobtitle: setJobTitle})
            res.json(newFavorite)
            newFavorite.save()
        } catch (err) {
            console.error(err)
        }         
      
}

exports.getBookmarkContactByFolderID = async (req, res) => {
    const folderID = req.body.folderID  
    try {
        const Contact = await addToFolder.find({folderID: folderID})
        res.json(Contact)
    } catch (err) {
        console.error(err)
    }
}

exports.getContactById = async (req, res) => {
    const inputId = sanitize(req.body.id);
    try{
        for (i = 0 ; i < inputId.length; i++) {
            console.log(inputId[i])
            const contact = await pool.query("SELECT * FROM contact_data WHERE id = $1", [inputId[i]])
            if (contact.rows.length >= 1) {
                const contacts = await pool.query("SELECT *  FROM contact_data WHERE id = $1", [inputId[i]]);
                res.json(contacts.rows)
            } else {
                const contact = await Contacts.find({id: inputId[i]})
                res.json(contact)
            }
        }
    
    } catch (err) {
        console.error(err)
    }   
}

exports.getMultipleContactsById = async (req, res) => {
    const inputId = req.body.id;
    try{
        // for (i = 0 ; i < inputId.length; i++) {
            console.log(inputId)
            const contact = await pool.query("SELECT * FROM contact_data WHERE id = $1", [inputId])
            if (contact.rows.length >= 1) {
                const contacts = await pool.query("SELECT *  FROM contact_data WHERE id = $1", [inputId]);
                res.json(contacts.rows)
            } else {
                const contact = await Contacts.find({id: inputId[i]})
                res.json(contact)
            }
        // }
    
    } catch (err) {
        console.error(err)
    }   
}


exports.deleteOneContactfromFolder = async (req, res) => {
    const ID = req.body.id;
    try{
        const contact = await addToFolder.findOneAndDelete({_id: ID})
        res.json(contact)
    } catch (err) {
        console.error(err)
    } 
}
