const User = require("../models/user.js");
const { StatusCodes } = require("http-status-codes"); //These codes are used to indicate the result of an HTTP request-->>>StatusCodes.OK, StatusCodes.CREATED, and StatusCodes.BAD_REQUEST are constants provided by the library to represent the corresponding HTTP status codes. This helps keep the code clear and consistent.
const {
  BadRequestError,
  UnauthenticatedError,
} = require("../errors/errors.js");
const bcrypt = require("bcryptjs"); // npm install bcryptjs ---->>>Used for secure password management.--->>comparePassword

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};
const login = async (req, res) => {
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
};

/*test for the router is working*/
const test1 = async (req, res) => {
  res.send("IT IS A TEST....Auth route is working!");
};

module.exports = { register, login, test1 };
