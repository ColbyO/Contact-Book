const express = require("express");
const router = express.Router();
const {getPrivateData, searchPostgreSQL, searchMongoDB, logSearches, getAllLogs} = require("../controllers/private")
const { protect } = require('../middleware/auth')

router.route("/").get(protect, getPrivateData);

router.route("/search/postgresql").post(protect, searchPostgreSQL)

router.route("/search/mongodb").post(protect, searchMongoDB)

router.route("/log/search").post(protect, logSearches)

router.route("/logs").post(protect, getAllLogs)

module.exports = router;