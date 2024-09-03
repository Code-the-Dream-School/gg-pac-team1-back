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

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/reset-password/${resetToken}`;

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
    const userId = req.user.userId; // Suponiendo que estás usando un middleware para autenticar al usuario y agregar req.user

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
      creditCards: user.creditCards, // Suponiendo que has agregado un campo para tarjetas de crédito
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const {
    body: { name, phone, address, creditCards }, // Nota que ahora es creditCards (arreglo)
    user: { userId }, // ID del usuario autenticado
  } = req;

  // Verifica que los campos requeridos no estén vacíos
  if (!name || !phone || !address) {
    throw new BadRequestError("Name, phone, and address cannot be empty");
  }

  // Verifica que la información de las tarjetas de crédito sea válida si está presente
  if (creditCards && !Array.isArray(creditCards)) {
    throw new BadRequestError("Credit cards must be an array");
  }

  try {
    // Actualiza el usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, address, creditCards }, // Actualiza también creditCards
      { new: true, runValidators: true } // `new: true` devuelve el documento actualizado
    );

    // Maneja el caso donde el usuario no es encontrado
    if (!updatedUser) {
      throw new NotFoundError(`No user found with id ${userId}`);
    }

    // Envía una respuesta con el usuario actualizado
    res.status(StatusCodes.OK).json({
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        creditCards: updatedUser.creditCards, // Asegúrate de que esto esté incluido
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    throw new BadRequestError("Error updating user");
  }
};

/*test for the router is working*/
const test1 = async (req, res) => {
  res.send("IT IS A TEST....Auth route is working!");
};

module.exports = {
  register,
  login,
  test1,
  resetPassword,
  forgotPassword,
  getUser,
  updateUser,
};
