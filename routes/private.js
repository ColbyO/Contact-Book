const express = require("express");
const router = express.Router();
const {searchPostgreSQL, searchMongoDB, logSearches, getAllLogs, getContactInfo, getCurrentUser, updateContactInfo, deleteOneContact, deleteManyContacts, addContact} = require("../controllers/private")
const { protect } = require('../middleware/auth')

router.route("/search/postgresql").post(protect, searchPostgreSQL)

router.route("/search/mongodb").post(protect, searchMongoDB)

router.route("/log/search").post(protect, logSearches)

router.route("/logs").post(protect, getAllLogs)

router.route("/get/contact").post(protect, getContactInfo)

router.route("/get/currentuser").get(protect, getCurrentUser)

router.route("/update/contactinfo").put(protect, updateContactInfo)

router.route("/delete/contact").delete(protect, deleteOneContact)

router.route("/delete/contacts").delete(protect, deleteManyContacts)

router.route("/add/contact").post(protect, addContact)

module.exports = router;