const CreditCard = require("../models/creditCard");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");

const createCreditCard = async (req, res) => {
  const { stripePaymentMethodId } = req.body;
  const userId = req.user.userId;

  try {
    const newCard = await CreditCard.create({ userId, stripePaymentMethodId });
    res.status(StatusCodes.CREATED).json({ card: newCard });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

// all tarjetas de crédito del user
const getCreditCards = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cards = await CreditCard.find({ userId });
    console.log("Retrieved cards:", cards);
    res.status(StatusCodes.OK).json({ cards });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const deleteCreditCard = async (req, res) => {
  const { id } = req.params;

  try {
    const card = await CreditCard.findByIdAndDelete(id);
    if (!card) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Card not found" });
    }
    res.status(StatusCodes.OK).json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = { createCreditCard, getCreditCards, deleteCreditCard };
