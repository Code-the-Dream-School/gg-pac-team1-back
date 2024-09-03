const express = require('express')
const router = express.Router()

const {
    getAllHotels,
    getSingleHotel,
    createHotel,
    deleteHotel,
    updateHotel
} = require('../controllers/hotels')

router.route('/').get(getAllHotels).post(createHotel)
router.route('/:id').get(getSingleHotel).delete(deleteHotel).patch(updateHotel)


module.exports = router