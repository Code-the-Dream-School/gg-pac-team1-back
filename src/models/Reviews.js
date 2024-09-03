const mongoose = require("mongoose");

const attractionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Attraction name is required"],
  },
  type: {
    type: String,
    enum: ["general", "restaurant", "museum", "park", "hotel"],
    default: "general",
  },
});

const reviewSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Please provide your review"],
  },
  rating: {
    type: Number,
    required: [true, "Please provide a rating between 1 and 5"],
    min: 1,
    max: 5,
    default: 3,
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
    required: function () {
      // `destination` is required if `attraction` is not provided
      return !this.attraction;
    },
  },
  attraction: {
    type: attractionSchema, // Definiendo attraction como un subdocumento con su propio schema
    required: function () {
      return !this.destination; //just 1 destination or attraction most be require
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a user"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
