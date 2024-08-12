const Flight = require("../models/flights");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/errors");

const createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(StatusCodes.CREATED).json(flight);
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find({});
    res.status(StatusCodes.OK).json(flights);
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const getFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      throw new NotFoundError("Flight not found");
    }
    res.status(StatusCodes.OK).json(flight);
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!flight) {
      throw new NotFoundError("Flight not found");
    }
    res.status(StatusCodes.OK).json(flight);
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      throw new NotFoundError("Flight not found");
    }
    res.status(StatusCodes.OK).json({ message: "Flight deleted" });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};
/*test for the router is working*/
const test2 = async (req, res) => {
  res.send("IT IS A TEST....Auth route is working!");
};

module.exports = {
  createFlight,
  getAllFlights,
  getFlight,
  updateFlight,
  deleteFlight,
  test2,
};
