const express = require("express");
const router = express.Router();
const {
  createReview,
  updateReview,
  deleteReview,
  getReviews,
} = require("../controllers/ReviewsController");
const authenticateUser = require("../middleware/authentication"); // Middleware para autenticar al usuario

router.post("/", authenticateUser, createReview); //create review
router.patch("/:reviewId", authenticateUser, updateReview);
router.delete("/:reviewId", authenticateUser, deleteReview);
router.get("/:destinationId", getReviews); //// Get reviews for a specific destination
router.get("/", getReviews); //all

module.exports = router;
