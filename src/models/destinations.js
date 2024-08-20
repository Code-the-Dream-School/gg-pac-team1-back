const { string } = require("joi");
const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, "please provide your city of destination"],
    maxLength: 200,
  },
  country: {
    type: String,
    required: [true, "please provide your country destination "],
    maxLength: 200,
  },
  attractionNames: {
    type: [String],
    required: [true, "Please provide names of the attractions"],
  },
  bookingDates: [
    {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
  ],
  categories: {
    type: [String],
    enum: [
      "family-friendly",
      "wellness",
      "budget-travel",
      "trending",
      "romantic",
      "foodie",
    ],
    required: true,
  },

  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a user"],
  },
});

module.exports = mongoose.model("Destination", destinationSchema);
