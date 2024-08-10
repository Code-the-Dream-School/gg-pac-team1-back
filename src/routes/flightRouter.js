const express = require("express");
const router = express.Router();
const flightController = require("../controllers/flightsController");

router
  .route("/")
  .post(flightsController.createFlight)
  .get(flightsController.getAllFlights);

router
  .route("/:id")
  .get(flightsController.getFlight)
  .patch(flightsController.updateFlight)
  .delete(flightsController.deleteFlight);

module.exports = router;
