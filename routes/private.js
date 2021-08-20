const express = require("express");
const router = express.Router();
// every request
const {searchPostgreSQL, 
    searchMongoDB, 
    logSearches, 
    getAllLogs, 
    getContactInfo, 
    getCurrentUser, 
    updateContactInfo, 
    deleteOneContact, 
    deleteManyContacts, 
    addContact, 
    updateUser,
    currentFolder,
    createFolder,
    allFolder,
    deleteFolder,
    addToFolder,
    addManyToFolder,
    getContactById,
    getMultipleContactsById,
    getBookmarkContactByFolderID,
    deleteOneContactfromFolder
} = require("../controllers/private")
// check if user has auth
const { protect } = require('../middleware/auth')

//////////////////// POST REQUESTS \\\\\\\\\\\\\\\\\\

// search postgresql database for contacts
router.route("/search/postgresql").post(protect, searchPostgreSQL)

// search mongodb database for contacts
router.route("/search/mongodb").post(protect, searchMongoDB)

// log user searches
router.route("/log/search").post(protect, logSearches)

// get every logged search
router.route("/logs").post(protect, getAllLogs)

// get contact info 
router.route("/get/contact").post(protect, getContactInfo)

// create a contact
router.route("/add/contact").post(protect, addContact)

// create a folder
router.route("/add/folder").post(protect, createFolder)

// get current folder
router.route("/get/currentfolder").post(protect, currentFolder)

// add one contact to folder
router.route("/addto/folder").post(protect, addToFolder)

// add multiple contacts to folder
router.route("/addmanyto/folder").post(protect, addManyToFolder)

// get contact thats bookmarked by id
router.route("/get/bookmarkcontent").post(protect, getBookmarkContactByFolderID)

// get contact
router.route("/get/contactbyid").post(protect, getContactById)

// get multiple contacts
router.route("/get/multiplecontactsbyid").post(protect, getMultipleContactsById)

//////////////////// PUT REQUESTS \\\\\\\\\\\\\\\\\\

// update user settings
router.route("/update/user").put(protect, updateUser)

// update contact info
router.route("/update/contactinfo").put(protect, updateContactInfo)

//////////////////// GET REQUESTS \\\\\\\\\\\\\\\\\\

// get every folder
router.route("/get/folders").get(protect, allFolder)

// get a current user for auth
router.route("/get/currentuser").get(protect, getCurrentUser)

//////////////////// DELETE REQUESTS \\\\\\\\\\\\\\\\\\

// delete one contact
router.route("/delete/contact").delete(protect, deleteOneContact)

// delete multiple contacts
router.route("/delete/contacts").delete(protect, deleteManyContacts)

// delete a folder
router.route("/delete/folder").delete(protect, deleteFolder)

// delete one contact from folder
router.route("/delete/contactfromfolder").delete(protect, deleteOneContactfromFolder)





module.exports = router;