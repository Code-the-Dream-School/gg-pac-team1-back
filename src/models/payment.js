const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, "Please provide the amount"],
  },
  currency: {
    type: String,
    required: [true, "Please provide the currency"],
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "bank_transfer"],
    required: [true, "Please specify the payment method"],
  },
  bookingId: {
    type: mongoose.Types.ObjectId,
    ref: "Booking",
    required: [true, "Please specify the booking ID"],
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please specify the user ID"],
  },
  transactionId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
