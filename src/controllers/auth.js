const User = require("../models/user.js");
const { StatusCodes } = require("http-status-codes"); //These codes are used to indicate the result of an HTTP request-->>>StatusCodes.OK, StatusCodes.CREATED, and StatusCodes.BAD_REQUEST are constants provided by the library to represent the corresponding HTTP status codes. This helps keep the code clear and consistent.
const {
  BadRequestError,
  UnauthenticatedError,
  ConflictError,
} = require("../errors/errors.js");
const bcrypt = require("bcryptjs"); // npm install bcryptjs ---->>>Used for secure password management.--->>comparePassword
const crypto = require("crypto"); //token resetpassword
const nodemailer = require("nodemailer"); //send email
require("dotenv").config(); //load environment variables from  .env

// Configura el transporte de correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
console.log("EMAIL_USERNAME:", process.env.EMAIL_USERNAME);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);

const register = async (req, res) => {
  try {
    //Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      throw new ConflictError("Email already in use");
    }
    const user = await User.create({ ...req.body }); //created user
    const token = user.createJWT(); //created token
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
  } catch (error) {
    if (error.code && error.code === 11000) {
      //Handle duplicate key errors
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Duplicate key error: Email already in use" });
    }
    console.error("Error during registration:", error);
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
  //res.send("register user");
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("please insert email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("invalid Credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("invalid Credentials");
    }
    const token = user.createJWT();
    res
      .status(StatusCodes.OK)
      .json({ user: { name: user.name, id: user._id }, token });
  } catch (error) {
    // Manejar errores y enviar una respuesta JSON adecuada
    if (
      error instanceof BadRequestError ||
      error instanceof UnauthenticatedError
    ) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "An unexpected error occurred" });
    }
  }
};

//SEND EMAIL TO RECOVER PASSWORD

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide an email");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("User not found");
  }

  // Genera el token de reset
  const resetToken = user.getResetPasswordToken();
  await user.save();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`; //<--------PARA QUE FUNCIONE EN EL FRONTEND EL URL SEA DEL SERVER 3000 SE SUSTITUYE EL REQ.PROTOCOLO POR LA VARIABLE DE FRONTEND_URL
  console.log("FRONTEND_URL que estara en el archivo .env", resetUrl);
  /*const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/reset-password/${resetToken}`;*/

  const message = `You requested a password reset. Please go to this link to reset your password: \n\n ${resetUrl}`;

  try {
    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });

    res.status(StatusCodes.OK).json({ message: "Reset email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    throw new Error("There was an error sending the email. Try again later.");
  }
};

const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new BadRequestError("Invalid token or token has expired");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(StatusCodes.OK).json({ message: "Password updated successfully" });
};

const getUser = async (req, res) => {
  try {
    // Obtener el ID del usuario desde el token JWT
    const userId = req.user.userId;

    // Buscar al usuario en la base de datos
    const user = await User.findById(userId).select("-password"); // Excluyendo la contraseña del resultado

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // Enviar la respuesta con la información del usuario
    res.status(StatusCodes.OK).json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      creditCards: user.creditCards,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { name, phone, address, creditCards } = req.body;
  const userId = req.user.userId;
  //<-------AQUI------>
  console.log("Request Body:", req.body);
  console.log("User Before Update:", user);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    // update inf
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (creditCards && Array.isArray(creditCards)) {
      user.creditCards = creditCards;
    }
    await user.save();
    //data update
    res.status(StatusCodes.OK).json({
      message: "User information updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        creditCards: user.creditCards,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating user", error: error.message });
  }
};

/*test for the router is working*/
const test1 = async (req, res) => {
  res.send("IT IS A TEST....Auth route is working!");
};

module.exports = {
  transporter,
  register,
  login,
  test1,
  resetPassword,
  forgotPassword,
  getUser,
  updateUser,
};
