const express = require("express");
const router = express.Router();
const {
  addReviewToHotel,
  getReviewsByHotel,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controllers/ReviewsHotels");

// add review an get review to 1 hotel
router
  .route("/:hotelId/reviews")
  .post(addReviewToHotel) // Añadir reseña
  .get(getReviewsByHotel); // Obtener all reviews for one hotel

// get especific review, update and delete
router
  .route("/:reviewId")
  .get(getSingleReview)
  .patch(updateReview)
  .delete(deleteReview);

module.exports = router;
