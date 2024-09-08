const mongoose = require("mongoose");
const { Schema } = mongoose;

const hotelReviewSchema = new Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HotelReview", hotelReviewSchema);
