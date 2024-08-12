const express = require("express");
const router = express.Router();

const { login, register, test1 } = require("../controllers/auth");

router.get("/", test1);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
