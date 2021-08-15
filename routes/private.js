const express = require("express");
const router = express.Router();
const {searchPostgreSQL, searchMongoDB, logSearches, getAllLogs, getContactInfo, getCurrentUser} = require("../controllers/private")
const { protect } = require('../middleware/auth')

router.route("/search/postgresql").post(protect, searchPostgreSQL)

router.route("/search/mongodb").post(protect, searchMongoDB)

router.route("/log/search").post(protect, logSearches)

router.route("/logs").post(protect, getAllLogs)

router.route("/get/contacts").post(protect, getContactInfo)

router.route("/get/currentuser").get(protect, getCurrentUser)

module.exports = router;