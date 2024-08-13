const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController.js");

router.get("/", mainController.get); //http://localhost:8000/api/v1/ in the browser

module.exports = router;
