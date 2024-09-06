const express = require('express')
const router = express.Router()

const {getBookingsByRoom, createBooking} = require('../controllers/booking')

router.route('/rooms/:roomId').get(getBookingsByRoom).post(createBooking)

module.exports = router