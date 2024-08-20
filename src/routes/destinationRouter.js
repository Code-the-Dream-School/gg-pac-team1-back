const express = require("express");
const router = express.Router();
const {
  createDestination,
  getAllDestinations,
  getDestination,
  updateDestination,
  deleteDestination,
  getDestinationsByCategory,
} = require("../controllers/destinationsControllers");

// Routes
router.post("/", createDestination);
router.get("/", getAllDestinations);
router.get("/:id", getDestination);
router.patch("/:id", updateDestination);
router.delete("/:id", deleteDestination);

// Route to get destinations by category
router.get("/category/:category", getDestinationsByCategory);

module.exports = router;
