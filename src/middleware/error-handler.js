const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, please try again later",
  };

  // Validation Errors
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Duplicate Key Error
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value for ${Object.keys(
      err.keyValue
    )} field. Please choose another value.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Cast Error
  if (err.name === "CastError") {
    customError.msg = `No item found with id ${err.value}.`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  // Send response
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
