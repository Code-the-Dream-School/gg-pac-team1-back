const express = require("express");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");

const mainRouter = require("./routes/mainRouter.js");
const flightRouter = require("./routes/flightRouter.js");
const authRouter = require("./routes/auth.js");
const destinationRouter = require("./routes/destinationRouter.js");
const errorHandlerMiddleware = require("./middleware/error-handler.js");

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/favicon.ico"));
const AuthenticateUser = require("./middleware/authentication.js");
const { required } = require("joi");

// routes
app.use("/api/v1", mainRouter); //http://localhost:8000/api/v1/ browser
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/flights", AuthenticateUser, flightRouter);
app.use("/api/v1/destinations", AuthenticateUser, destinationRouter);

app.use(errorHandlerMiddleware);

module.exports = app;
