const Stripe = require("stripe");
const { StatusCodes } = require("http-status-codes");
const { transporter } = require("./auth.js");
const User = require("../models/user");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // just for test no real word

// cargo usando PaymentIntents--->> more modern
const createCharge = async (req, res) => {
  const { amount, currency, description, paymentMethodId } = req.body;
  const userId = req.user.userId; // ID user uth

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convertir a centavos
      currency: currency,
      description: description,
      payment_method: paymentMethodId,
      confirm: true, // Confirm paymwnt
      automatic_payment_methods: {
        enabled: true, // Permitir métodos de pago automáticos
        allow_redirects: "never", // No permitir redirecciones
      },
    });

    // Oget user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    // send email confirmation
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: "Payment Confirmation",
      text: `Dear ${user.name},\n\nYour payment of ${amount} ${currency} has been successfully processed.\n\nTransaction ID: ${paymentIntent.id}\n\nThank you for your purchase!\n\nBest regards,\nYour Company TravelAmigos`,
    };

    await transporter.sendMail(mailOptions);

    res.status(StatusCodes.CREATED).json({ paymentIntent });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = { createCharge };
