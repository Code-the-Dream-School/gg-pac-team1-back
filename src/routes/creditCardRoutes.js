const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const {
  createCreditCard,
  getCreditCards,
  deleteCreditCard,
} = require("../controllers/creditCardController");

router.post("/", authenticateUser, createCreditCard);
router.get("/", authenticateUser, getCreditCards);
router.delete("/:id", authenticateUser, deleteCreditCard);

module.exports = router;
