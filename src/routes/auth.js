const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");

const {
  login,
  register,
  test1,
  forgotPassword,
  resetPassword,
  getUser,
  updateUser,
} = require("../controllers/auth");

router.get("/", test1);
router.post("/register", register);
router.post("/login", login);
router.get("/user", auth, getUser);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/user", auth, updateUser);
module.exports = router;
