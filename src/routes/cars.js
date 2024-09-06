const express = require('express')
const router = express.Router()

const {getAllCars, 
    getSingleCar, 
    createCar, 
    deleteCar, 
    updateCar} = require('../controllers/cars')


router.route('/').get(getAllCars).post(createCar)
router.route('/:id').get(getSingleCar).delete(deleteCar).patch(updateCar)

module.exports = router