const express = require("express");
const router = express.Router();

const {
  getAllFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
  test2,
} = require("../controllers/flightsController");



router.get("/", test2);

router.route("/").post(createFlight).get(getAllFlights);
router.route("/:id").get(getFlight).delete(deleteFlight).patch(updateFlight);

module.exports = router;
