const express = require("express");
const router = express.Router();
const {
  addItemToCart,
  getCart,
  removeItemFromCart,
} = require("../controllers/shoppingCartController");

router.post("/add", addItemToCart);
router.get("/", getCart); //to get cart of the user
router.delete("/remove/:itemId", removeItemFromCart);

module.exports = router;
