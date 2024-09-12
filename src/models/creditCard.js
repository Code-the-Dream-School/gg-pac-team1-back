const mongoose = require("mongoose");

const CreditCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stripePaymentMethodId: {
    type: String,
    required: true,
    unique: true,
  },
  last4: {
    type: String,
    required: true, // save last 4 of the card
  },
});

module.exports = mongoose.model("CreditCard", CreditCardSchema);
