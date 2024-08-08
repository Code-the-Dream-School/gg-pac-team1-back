const { string } = require("joi");
const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: [true, "please provide flight number"],
    unique: true, //Ensures that each flight number is unique in the database.
    maxlength: 50,
  },
  airline: {
    type: String,
    required: [true, "please provide the airline"],
    maxlength: 200,
  },
  departureAirport: {
    type: String,
    required: [true, "Origin is required"],
  },
  departureTime: {
    type: Date,
    required: [true, "Departure time is required"],
  },
  arrivalAirport: {
    type: String,
    required: [true, "Destination is required"],
  },
  arrivalTime: {
    type: Date,
    required: [true, "Arrival time is required"],
  },
  rates: {
    type: Number,
    require: true,
  },
  bookingDates: {
    type: Date,
    required: [true, "select dates"],
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a user"],
  },
});

module.exports = mongoose.model("flight", flightSchema);
