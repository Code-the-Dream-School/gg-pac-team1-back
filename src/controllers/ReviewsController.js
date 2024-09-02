const Review = require("../models/Reviews");
const Destination = require("../models/destinations");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors/errors");

const createReview = async (req, res) => {
  const { destination, rating, text, attraction } = req.body;
  const createdBy = req.user.userId;

  if (!destination || !rating || !text) {
    throw new BadRequestError("All fields are required");
  }

  if (rating < 1 || rating > 5) {
    throw new BadRequestError("Rating must be between 1 and 5");
  }

  try {
    const existingDestination = await Destination.findById(destination);
    if (!existingDestination) {
      throw new NotFoundError("Destination not found");
    }

    // Si se proporciona `attraction`, valida y usa el objeto completo
    let attractionData = null;
    if (attraction) {
      attractionData = {
        name: attraction.name,
        type: attraction.type,
      };
    }

    const review = await Review.create({
      destination,
      attraction: attractionData,
      rating,
      text,
      createdBy,
    });

    const populatedReview = await Review.findById(review._id)
      .populate({
        path: "destination",
        select: "city country", //by destino
      })
      .populate({
        path: "attraction", //by attraction
      })
      .populate({
        path: "createdBy",
        select: "name", // Optional: Populate user who created the review
      })
      .exec();

    res.status(StatusCodes.CREATED).json({ review: populatedReview });
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Failed to create review");
  }
};

const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, text, destination, attraction } = req.body;

  try {
    // search review por ID
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new NotFoundError("Review not found");
    }

    // Check authorization
    if (req.user.userId !== review.createdBy.toString()) {
      throw new UnauthorizedError("Not authorized to update this review");
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        throw new BadRequestError("Rating must be between 1 and 5"); // Validate and update fields
      }
      review.rating = rating;
    }

    if (text) {
      review.text = text;
    }

    let updatedAttraction = null;
    if (destination) {
      const existingDestination = await Destination.findById(destination);
      if (!existingDestination) {
        throw new NotFoundError("Destination not found");
      }
      review.destination = destination;

      if (attraction) {
        const destId = destination || review.destination; // Make sure 'destination' or 'review.destination' is present
        console.log("Destination ID:", destId); // verify ID destination

        const existingDestination = await Destination.findById(destId); // Search existing destination
        if (!existingDestination) {
          throw new NotFoundError("Destination not found");
        }

        const existingAttraction = existingDestination.attractions.id(
          attraction._id
        ); // Search attraction in the destination
        if (existingAttraction) {
          // update attractoin
          existingAttraction.name = attraction.name || existingAttraction.name;
          existingAttraction.type = attraction.type || existingAttraction.type;
          updatedAttraction = existingAttraction; //save update attraction
        } else {
          // if attraction exist, add
          existingDestination.attractions.push(attraction);
          updatedAttraction = attraction; // save atraccion a la resp
        }
        await existingDestination.save();
      }
    }

    await review.save();

    // Poblar las referencias para la respuesta
    const updatedReview = await Review.findById(review._id)
      .populate({
        path: "destination",
        select: "city country attractions",
        populate: {
          path: "attractions",
          select: "name type",
        },
      })
      .populate({
        path: "createdBy",
        select: "name",
      });

    // Construir la respuesta
    const response = {
      review: updatedReview,
      updatedAttraction: updatedAttraction || null, // add attraction update to response
    };

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error("Error updating review:", error);
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: error.message });
  }
};

const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    // search review by Id
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      throw new NotFoundError("Review not found");
    }

    if (req.user.userId !== review.createdBy.toString()) {
      throw new UnauthorizedError("Not authorized to delete this review");
    }

    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new BadRequestError("Failed to delete review");
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({
        path: "destination",
        select: "city country", // Select the 'city' and 'country' fields
      })
      .populate({
        path: "attraction",
        select: "name description", // Select the desired fields from the Attraction model
      })
      .populate({
        path: "createdBy",
        select: "name", // Opcional: Selecciona el campo 'name' del modelo User
      });

    res.status(StatusCodes.OK).json({ reviews });
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Failed to retrieve reviews");
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReviews,
};
