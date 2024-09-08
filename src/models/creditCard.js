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
});

module.exports = mongoose.model("CreditCard", CreditCardSchema);
