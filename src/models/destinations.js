const { string } = require("joi");
const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, "please provide your city of destination"],
    maxLength: 100,
  },
  country: {
    type: String,
    required: [true, "please provide your country destination "],
    maxLength: 200,
  },
  atractionNames: {
    type: string,
    require: [true, "please provide name of the atraction"],
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

module.exports = mongoose.model("Destinations", destinationSchema);
