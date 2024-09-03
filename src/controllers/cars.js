const {NotFoundError, BadRequestError} = require('../errors/errors')
const Car = require('../models/cars')
const {StatusCodes} = require('http-status-codes')


const getAllCars = async(req, res) => {
    const cars = await Car.find().sort('-createdAt')
    res.status(StatusCodes.OK).json({cars})
}

const getSingleCar = async(req, res) => {
    const {// user: {userId}
        params: {id: carId}} = req
    const car = await Car.findOne({_id: carId
        //, createdBy: userId
    })
    if(!car) {
        throw new NotFoundError(`No car found with if ${carId}`)
    }

    res.status(StatusCodes.OK).json({ car })
}

const createCar  = async (req, res) => {
    // req.body.createdBy = req.user.userId
    const car = await Car.create(req.body)
    res.status(StatusCodes.CREATED).json({car})
}

const deleteCar = async (req, res) => {
    const {//user: {userId}//
    params: {id: carId}} = req
    const car = await Car.findOneAndDelete({_id: carId
        //, createdBy: userId
        })
    if (!car) {
        throw new NotFoundError(`No car with id ${carId}`)
    }    

    req.status(StatusCodes.OK).send("Car deleted")
}


const updateCar = async (req, res) => {
    const {body: {make, year},
    // user: {userId},
    params: {id: carId}} = req

    if(year === '') {
        throw new BadRequestError('Year can not be empty!')
    }

    if (make === '') {
        throw new BadRequestError('make can not be empty!')
    }

    const car = await Car.findByIdAndUpdate({_id: carId,
        //createdBy: userId
        },
        req.body, {new: true, runValidators: true}
    )

    if (!car) {
        throw new NotFoundError(`No car with id ${carId}`)
    }

    res.status(StatusCodes.Ok).json({ car })
}



module.exports = {getAllCars, getSingleCar, createCar, deleteCar, updateCar}