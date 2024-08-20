const Destination = require("../models/destinations");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/errors");

const createDestination = async (req, res) => {
  try {
    req.body.createdBy = req.user.userId; // Ensure the destination is associated with the user
    const destination = await Destination.create(req.body);
    res.status(StatusCodes.CREATED).json(destination);
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({
      createdBy: req.user.userId,
    }).sort("createdAt");
    res
      .status(StatusCodes.OK)
      .json({ destinations, count: destinations.length });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const getDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      throw new NotFoundError("Destination not found");
    }
    res.status(StatusCodes.OK).json(destination);
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
    res.status(StatusCodes.OK).json(destination);
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
    res.status(StatusCodes.OK).json(destinations);
  } catch (error) {
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
};
