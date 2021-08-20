// MODELS
const User = require("../models/User");
const Contacts = require("../models/Contacts");
const searchLogs = require("../models/Logs");
const Folder = require("../models/Folder");
const addToFolder = require("../models/addToFolder");
// DEPENDENCIES
const pool = require('../config/pg');
const sanitize = require('mongo-sanitize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// search pg database
exports.searchPostgreSQL = async (req, res) => {
    try{
        // get user inputs 
        const {searchTerm, searchQuery} = req.body;
        // for like sql
        let searchTermNew = searchTerm + '%'
        // if statements for what user filtered search by.
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

// search mongodb
exports.searchMongoDB = async (req, res) => {
    try{
        // user inputs and sanitize incase injections
        const {searchQuery, searchTerm} = sanitize(req.body); 
        // if statements for what user filtered by
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

// log user searches in mongodb
exports.logSearches = async (req, res)=> {
    try {
        const logSearch = new searchLogs({username: sanitize(req.body.user), searchTerm: sanitize(req.body.searchTerm), database: sanitize(req.body.database), searchQuery: sanitize(req.body.searchQuery)})
        res.json(logSearch)
        await logSearch.save()
    } catch (err) {
        console.error(err)
    }
}

// get all logs in database
exports.getAllLogs = async (req, res)=> {
    try{
        let allLogs = await searchLogs.find()
        res.json(allLogs)
    } catch (err) {
        console.error(err)
    }
}

// get contacts by id 
exports.getContactInfo = async (req, res) => {
    // user inputs
    const contactID = sanitize(req.body.id);
    try{
        // find one contact by id
        const contact = await Contacts.findOne({id: contactID})
        // if no contact was found, must be in other databse
        if (contact === null) {
            const contacts = await pool.query("SELECT * FROM contact_data WHERE id = $1", [contactID]);
            res.json(contacts.rows)
        }
        // if contact was found in mongodb send res.
        if (contact !== null) {
            res.json(contact)
        }
    } catch (err) {
        console.error(err)
    }
}

// updated contact info
exports.updateContactInfo = async (req, res) => {
    // user input
    const contactID = sanitize(req.body.id);
    const setFirstname = sanitize(req.body.firstname);
    const setLastname = sanitize(req.body.lastname);
    const setEmail = sanitize(req.body.email);
    const setPhone = sanitize(req.body.phone);
    const setCompany = sanitize(req.body.company);
    const setDepartment = sanitize(req.body.department);
    const setJobTitle = sanitize(req.body.jobtitle);

    try{
        // find contact by id
        const contact = await Contacts.findOne({id: contactID})
        // if no contac was found update in postgresql
        if (contact === null) {
            const contacts = await pool.query("UPDATE contact_data SET firstname = $1, lastname = $2, email = $3, phone = $4, company = $5, department = $6, jobtitle = $7 WHERE id = $8", [setFirstname, setLastname, setEmail, setPhone, setCompany, setDepartment, setJobTitle, contactID]);
            res.json(contacts.command) // if updated sends UPDATE
            console.log(contacts.command)
        }
        // if contact was found update with user inputs
        if (contact !== null) {
            const updated = await Contacts.updateOne({id: contactID}, {$set: {firstname: setFirstname, lastname: setLastname, email: setEmail, phone: setPhone, company: setCompany, department: setDepartment, jobtitle: setJobTitle}})
            console.log(updated)
        }
    } catch (err) {
        console.error(err)
    }
}

// update user settings
exports.updateUser = async (req, res) => {
    // user inputs
    const userID = req.body.id;
    const email = req.body.email;
    const password = req.body.password
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt)
    try {
        // update info in database
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

// delete one contact
exports.deleteOneContact = async (req, res) => {
    // user input
    const contactID = sanitize(req.body.id);
    try{
        // find contact by id
        const contact = await Contacts.findOne({id: contactID})
        // if no contact was found must be in other database
        if (contact === null) {
            const contacts = await pool.query("DELETE FROM contact_data WHERE id = $1", [contactID]);
            res.json(contacts.rows)
        }
        // if contact was found delete in mongodb
        if (contact !== null) {
            const contact = await Contacts.deleteOne({id: contactID})
            res.json(contact)
        }
    } catch (err) {
        console.error(err)
    } 
}

// delete many contacts
exports.deleteManyContacts = async (req, res) => {
    // user input, will be array
    const inputId = sanitize(req.body.id);
        try{
            // for loop to loop through input array
            for (i = 0 ; i < inputId.length; i++) {
                // search pg for ids
                const contact = await pool.query("SELECT * FROM contact_data WHERE id = $1", [inputId[i]])
                // if row was found in pg delete, else delete from mongodb
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

// add contact
exports.addContact = async (req, res) => {
    // user input
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
        // user user selected mongodb, create in mongodb
        if(database === "MongoDB") {
            const newContact = new Contacts({id: contactID, firstname: setFirstname, lastname: setLastname, email: setEmail, phone: setPhone, company: setCompany, department: setDepartment, jobtitle: setJobTitle})
            await newContact.save()
        }
        // user user selected postgresql, create in postgresql
        if (database === "PostgreSQL") {
            const newContact = await pool.query("INSERT INTO contact_data (id, firstname, lastname, email, phone, company, department, jobtitle) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [contactID ,setFirstname, setLastname, setEmail, setPhone, setCompany, setDepartment, setJobTitle])
            
        }
    } catch (err) {
        console.error(err)
    }
}

// check current user for token
exports.getCurrentUser = async (req, res) => {
    let token;
    // check headers for token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    try{
        // verify token of user
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        res.json(user)
    } catch (err) {
        console.error(err)
    }

}

// find current folder
exports.currentFolder = async (req, res) => {
    // user input
    const ID = req.body.id
    try {
        // find folders by parentID
        let currentFolder = await Folder.find({parentID: ID})
        res.json(currentFolder)
    } catch (err) {
        console.error(err)
    }   
}

// find every folder
exports.allFolder = async (req, res) => {
    try {
        let currentFolder = await Folder.find()
        res.json(currentFolder)
    } catch (err) {
        console.error(err)
    }   
}

// create folder
exports.createFolder = async (req, res) => {
    // user inputs
    const ID = req.body.id
    const folderName = sanitize(req.body.folderName)
    const parentID = sanitize(req.body.parentID)
    try {
        // create new folder in mongodb
        const folder = new Folder({userID: ID, folderName: folderName, parentID: parentID})
        res.json(folder)
        await folder.save()
    } catch (err) {
        console.error(err)
    }
}

// delete folder
exports.deleteFolder = async (req, res) => {
    // user input
    const ID = req.body.id
    try {
        // delete folder by id
        const deleteF = await Folder.deleteOne({_id: ID})
        res.json(deleteF)
    } catch (err) {
        console.error(err)
    }
}

// add contact to folder
exports.addToFolder = async (req, res) => {
    // user inputs
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
        // add contact to certain folder
        const newFavorite = new addToFolder({contactID: contactID, folderID: folderID, firstname: setFirstname, lastname: setLastname, email: setEmail, phone: setPhone, company: setCompany, department: setDepartment, jobtitle: setJobTitle})
        res.json(newFavorite)
        await newFavorite.save()
    } catch (err) {
        console.error(err)
    }
}

// add multiple folders
exports.addManyToFolder = async (req, res) => {
    // user inputs
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
            // add contacts to certain folder
            const newFavorite = new addToFolder({contactID: contactID, folderID: folderID, firstname: setFirstname, lastname: setLastname, email: setEmail, phone: setPhone, company: setCompany, department: setDepartment, jobtitle: setJobTitle})
            res.json(newFavorite)
            newFavorite.save()
        } catch (err) {
            console.error(err)
        }         
      
}

// get bookmark by folder id
exports.getBookmarkContactByFolderID = async (req, res) => {
    // user inputs
    const folderID = req.body.folderID  
    try {
        // find folder by folder id
        const Contact = await addToFolder.find({folderID: folderID})
        res.json(Contact)
    } catch (err) {
        console.error(err)
    }
}

// get contact by id
exports.getContactById = async (req, res) => {
    // user input
    const inputId = sanitize(req.body.id);
    try{
        // for loop to loop through user input array
        for (i = 0 ; i < inputId.length; i++) {
            // check if contact exists in postgres
            const contact = await pool.query("SELECT * FROM contact_data WHERE id = $1", [inputId[i]])
            // if contact find select from pg
            if (contact.rows.length >= 1) {
                const contacts = await pool.query("SELECT *  FROM contact_data WHERE id = $1", [inputId[i]]);
                res.json(contacts.rows)
            // if no data was found, must be in mongodb 
            } else {
                const contact = await Contacts.find({id: inputId[i]})
                res.json(contact)
            }
        }
    
    } catch (err) {
        console.error(err)
    }   
}

// get contact by id
exports.getMultipleContactsById = async (req, res) => {
    // user input
    const inputId = req.body.id;
    try{
        // check if contact exists in postgres
            const contact = await pool.query("SELECT * FROM contact_data WHERE id = $1", [inputId])
            // if contact find select from pg
            if (contact.rows.length >= 1) {
                const contacts = await pool.query("SELECT *  FROM contact_data WHERE id = $1", [inputId]);
                res.json(contacts.rows)
            // if no data was found, must be in mongodb 
            } else {
                const contact = await Contacts.find({id: inputId[i]})
                res.json(contact)
            }
    
    } catch (err) {
        console.error(err)
    }   
}

// delete one contact from folder
exports.deleteOneContactfromFolder = async (req, res) => {
    // user input
    const ID = req.body.id;
    try{
        // find contact by id and delete
        const contact = await addToFolder.findOneAndDelete({_id: ID})
        res.json(contact)
    } catch (err) {
        console.error(err)
    } 
}
