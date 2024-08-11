const express = require("express");
const router = express.Router();
const flightController = require("../controllers/flightsController");

router
  .route("/")
  .post(flightController.createFlight)
  .get(flightController.getAllFlights);

router
  .route("/:id")
  .get(flightController.getFlight)
  .patch(flightController.updateFlight)
  .delete(flightController.deleteFlight);

module.exports = router;
