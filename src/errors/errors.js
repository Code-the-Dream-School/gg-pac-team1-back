// Class for all custum errors
class CustomAPIError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500; // generals erors
  }
}

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 404; //  not found
  }
}

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 400; //invalid request
  }
}

class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 401; // unauthorized requests
  }
}

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

class ConflictError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 409; // data conflicts
  }
}

module.exports = {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  UnauthenticatedError,
  ConflictError,
};
