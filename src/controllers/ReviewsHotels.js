const Hotel = require("../models/hotels");
const HotelReview = require("../models/HotelReview");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

const addReviewToHotel = async (req, res) => {
  const { hotelId } = req.params;
  const { text, rating } = req.body;
  const userId = req.user.userId;

  try {
    // Verificar si el hotel existe
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `Hotel not found with ID: ${hotelId}` });
    }

    //create review
    const review = await HotelReview.create({
      text,
      rating,
      createdBy: userId,
      hotel: hotelId,
    });

    hotel.reviews.push(review._id); // Añadir la reseña al hotel
    await hotel.save();

    res.status(StatusCodes.CREATED).json({ review });
  } catch (error) {
    console.error("Error adding review to hotel:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error adding review to hotel" });
  }
};
const getReviewsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    console.log(`Hotel ID recibido: ${hotelId}`);

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid hotel ID." });
    }

    const reviews = await HotelReview.find({ hotel: hotelId }).populate(
      "createdBy",
      "name"
    );
    console.log(`Reseñas encontradas: ${reviews}`);

    if (!reviews || reviews.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No reviews found." });
    }

    res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    console.error("Error to get reviews:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error server" });
  }
};
const getSingleReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    console.log(`Fetching review with ID: ${reviewId}`);
    const review = await HotelReview.findById(reviewId).populate(
      "createdBy",
      "name"
    );
    if (!review) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Review not found" });
    }
    res.status(StatusCodes.OK).json({ review });
  } catch (error) {
    console.error("Error retrieving review:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error retrieving review" });
  }
};

const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await HotelReview.findByIdAndUpdate(reviewId, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name");
    if (!review) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Review not found" });
    }
    res.status(StatusCodes.OK).json({ review });
  } catch (error) {
    console.error("Error updating review:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error updating review" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await HotelReview.findByIdAndDelete(reviewId);
    if (!review) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Review not found" });
    }
    res.status(StatusCodes.OK).json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error deleting review" });
  }
};
module.exports = {
  addReviewToHotel,
  getReviewsByHotel,
  getSingleReview,
  updateReview,
  deleteReview,
};
