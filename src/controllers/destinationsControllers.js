const Destination = require("../models/destinations");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/errors");

const createDestination = async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);
    req.body.createdBy = req.user.userId; // Ensure the destination is associated with the user
    const destination = await Destination.create(req.body);

    // Formatted response including destinationId
    const response = {
      _id: destination._id.toString(),
      city: destination.city,
      country: destination.country,
      attractions: destination.attractions,
      bookingDates: destination.bookingDates,
      categories: destination.categories,
      createdBy: destination.createdBy,
      __v: destination.__v,
      destinationId: destination._id.toString(),
    };

    res.status(StatusCodes.CREATED).json(response);
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const getAllDestinations = async (req, res) => {
  //all  by User inf
  try {
    const destinations = await Destination.find({
      createdBy: req.user.userId,
    })
      .sort("createdAt")
      .lean(); //<--.lean() para obtener obj js

    // Map destinations to include destinationId and format attractions
    const destinationsWithId = destinations.map((destination) => ({
      _id: destination._id.toString(),
      city: destination.city,
      country: destination.country,
      attractions: destination.attractions.map((attr) => ({
        name: attr.name,
        type: attr.type,
      })),
      bookingDates: destination.bookingDates.map((date) => ({
        start: date.start,
        end: date.end,
      })),
      categories: destination.categories,
      createdBy: destination.createdBy.toString(),
      __v: destination.__v,
      destinationId: destination._id.toString(),
    }));

    // Log the formatted destinations with ID
    console.log(
      "Formatted destinations with ID:",
      JSON.stringify(destinationsWithId, null, 2)
    );

    res.status(StatusCodes.OK).json({
      destinations: destinationsWithId,
      count: destinationsWithId.length,
    });
  } catch (error) {
    console.error("Error fetching destinations:", error.message);
    throw new BadRequestError(error.message);
  }
};
const getDestination = async (req, res) => {
  // by Id destination
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      throw new NotFoundError("Destination not found");
    }

    // Formatted response including destinationId
    const response = {
      _id: destination._id.toString(),
      city: destination.city,
      country: destination.country,
      attractions: destination.attractions,
      bookingDates: destination.bookingDates,
      categories: destination.categories,
      createdBy: destination.createdBy,
      __v: destination.__v,
      destinationId: destination._id.toString(),
    };

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!destination) {
      throw new NotFoundError("Destination not found");
    }

    // Formatted response including destinationId
    const response = {
      _id: destination._id.toString(),
      city: destination.city,
      country: destination.country,
      attractions: destination.attractions,
      bookingDates: destination.bookingDates,
      categories: destination.categories,
      createdBy: destination.createdBy,
      __v: destination.__v,
      destinationId: destination._id.toString(),
    };

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      throw new NotFoundError("Destination not found");
    }
    res.status(StatusCodes.OK).json({ message: "Destination deleted" });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

// Get destinations by category
const getDestinationsByCategory = async (req, res) => {
  const { category } = req.params;

  if (!category) {
    throw new BadRequestError("Category is required");
  }

  try {
    const destinations = await Destination.find({ categories: category });
    if (!destinations.length) {
      throw new NotFoundError(
        `No destinations found for category: ${category}`
      );
    }

    // Map destinations to include destinationId
    const destinationsWithId = destinations.map((destination) => ({
      _id: destination._id.toString(),
      city: destination.city,
      country: destination.country,
      attractions: destination.attractions,
      bookingDates: destination.bookingDates,
      categories: destination.categories,
      createdBy: destination.createdBy,
      __v: destination.__v,
      destinationId: destination._id.toString(),
    }));

    res.status(StatusCodes.OK).json({
      destinations: destinationsWithId,
      count: destinationsWithId.length,
    });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const getDestinationWithReviews = async (req, res) => {
  try {
    console.log("Fetching destination with ID:", req.params.id);
    const destination = await Destination.findById(req.params.id).populate(
      "reviews"
    );
    if (!destination) {
      console.error("Destination not found");
      throw new NotFoundError("Destination not found");
    }
    console.log("Destination found with reviews:", destination.reviews);
    // Formatted response including destinationId
    const response = {
      _id: destination._id.toString(),
      city: destination.city,
      country: destination.country,
      attractionNames: destination.attractionNames,
      bookingDates: destination.bookingDates,
      categories: destination.categories,
      createdBy: destination.createdBy,
      __v: destination.__v,
      destinationId: destination._id.toString(),
      reviews: destination.reviews,
    };

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error("Error fetching destination with reviews:", error.message);
    throw new BadRequestError(error.message);
  }
};

module.exports = {
  createDestination,
  getAllDestinations,
  getDestination,
  updateDestination,
  deleteDestination,
  getDestinationsByCategory,
  getDestinationWithReviews,
};
