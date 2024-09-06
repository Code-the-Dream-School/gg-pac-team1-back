const express = require("express");
const router = express.Router();
const { createCharge } = require("../controllers/paymentsController");

router.post("/charge", createCharge); // to create charge

module.exports = router;
