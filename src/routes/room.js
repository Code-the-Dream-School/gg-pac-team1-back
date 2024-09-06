const express = require('express')
const router = express.Router()

const { createRoom, getAllRooms, getSingleRoomByHotelId, deleteRoom, getRooms } = require('../controllers/room')


router.route('/:hotelId').get(getAllRooms).post(createRoom);
router.route('/:roomId/hotels/:hotelId,').get(getSingleRoomByHotelId);
router.route('/:id').delete(deleteRoom);
router.route('/').get(getRooms)

module.exports = router