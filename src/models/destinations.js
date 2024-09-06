const { string } = require("joi");
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

const destinationSchema = new mongoose.Schema(
  {
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
    attractions: [attractionSchema],
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
    price: {
      type: Number,
      required: [true, "Please provide a price for the destination"],
      min: 0, // the price can not be negative OJO
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review", // Name of the  model Review
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", destinationSchema);
