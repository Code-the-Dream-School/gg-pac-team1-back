
const express = require('express');
const router = express.Router();

const {getAllBookings, getBookingsByRoom, createBooking, deleteBookings, updateBooking} = require('../controllers/booking');

router.route('/').get(getAllBookings).post(createBooking);;
router.route('/rooms/:roomId').get(getBookingsByRoom)
router.route('/:id').delete(deleteBookings).patch(updateBooking)

module.exports = router;
