const express = require("express");
const router = express.Router();
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
    getContactById,
    getBookmarkContactByFolderID
} = require("../controllers/private")
const { protect } = require('../middleware/auth')

router.route("/search/postgresql").post(protect, searchPostgreSQL)

router.route("/search/mongodb").post(protect, searchMongoDB)

router.route("/log/search").post(protect, logSearches)

router.route("/logs").post(protect, getAllLogs)

router.route("/get/contact").post(protect, getContactInfo)

router.route("/add/contact").post(protect, addContact)

router.route("/add/folder").post(protect, createFolder)

router.route("/get/currentfolder").post(protect, currentFolder)

router.route("/addto/folder").post(protect, addToFolder)

router.route("/get/bookmarkcontent").post(protect, getBookmarkContactByFolderID)

router.route("/get/contactbyid").post(protect, getContactById)

router.route("/update/user").put(protect, updateUser)

router.route("/get/folders").get(protect, allFolder)

router.route("/get/currentuser").get(protect, getCurrentUser)

router.route("/update/contactinfo").put(protect, updateContactInfo)

router.route("/delete/contact").delete(protect, deleteOneContact)

router.route("/delete/contacts").delete(protect, deleteManyContacts)

router.route("/delete/folder").delete(protect, deleteFolder)





module.exports = router;