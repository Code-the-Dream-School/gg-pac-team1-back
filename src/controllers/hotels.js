const {NotFountError, BadRequestError} = require('../errors/errors')
const Hotel = require('../models/hotels')
const {StatusCodes} = require('http-status-codes')


const getAllHotels = async (req, res) => {
    try {
        const { lat, lng, city, brand, chain, state, street,zipCode, limit = 250 } = req.query;
        const hotels = await Hotel.find().sort('-createdAt').populate('rooms');
        res.status(StatusCodes.OK).json({hotels})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching hotels', error })
    }
}

const getSingleHotel = async (req, res) => {
    const {user: {userId}, 
    params: {id: hotelId}}  = req
    const hotel = await Hotel.findOne({ _id: hotelId })

    if(!hotel) {
        throw new NotFountError(`No hotel with id ${hotelId}`)
    }

    res.status(StatusCodes.OK).json({ hotel })
}

const createHotel = async (req, res) => {
    try {
        req.body.createdBy = req.user.userId

        const hotel = await Hotel.create(req.body)
        res.status(StatusCodes.CREATED).json({ message: 'Hotel created successfully',  hotel })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating hotel', error })
    }

}

const deleteHotel = async (req, res) => {
    const {user: {userId}, 
        params: {id: hotelId}} = req
    const hotel = await Hotel.findOneAndDelete({_id: hotelId, 
        createdBy: userId})
    if(!hotel) {
        throw new NotFountError(`No hotel with id ${hotelId}`)
    }
    
    res.status(StatusCodes.OK).send("hotel deleted")

}    

const updateHotel = async (req, res) => {
    const {body, user: {userId}, 
        params: {id: hotelId}} = req;

    // checking the validation of the body properties
    for (const [key, value] of Object.entries(body)) {
        if (typeof value === 'string' && value.trim() === '') {
            throw new BadRequestError(`${key} cannot be empty`);
        }
        
        if (typeof value === 'object' && value !== null) {
            for (const [nestedKey, nestedValue] of Object.entries(value)) {
                if (typeof nestedValue === 'string' && nestedValue.trim() === '') {
                    throw new BadRequestError(`${nestedKey} in ${key} cannot be empty`);
                }
            }
        }
    }

    const hotel = await Hotel.findByIdAndUpdate({_id: hotelId,
        createdBy: userId
        }, 
        req.body, {new: true, runValidators: true})

    if (!hotel) {
        throw new NotFountError(`No hotel with id ${hotelId}`)
    }    

    res.status(StatusCodes.OK).json({ hotel })
}

module.exports = {
    getAllHotels,
    getSingleHotel,
    createHotel,
    deleteHotel,
    updateHotel
}