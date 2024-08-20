const User = require("../models/user.js");
const { StatusCodes } = require("http-status-codes"); //These codes are used to indicate the result of an HTTP request-->>>StatusCodes.OK, StatusCodes.CREATED, and StatusCodes.BAD_REQUEST are constants provided by the library to represent the corresponding HTTP status codes. This helps keep the code clear and consistent.
const {
  BadRequestError,
  UnauthenticatedError,
  ConflictError,
} = require("../errors/errors.js");
const bcrypt = require("bcryptjs"); // npm install bcryptjs ---->>>Used for secure password management.--->>comparePassword

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
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
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

/*test for the router is working*/
const test1 = async (req, res) => {
  res.send("IT IS A TEST....Auth route is working!");
};

module.exports = { register, login, test1 };
