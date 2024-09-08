const {NotFountError, BadRequestError} = require('../errors/errors')
const Room = require('../models/rooms')
const Hotel = require('../models/hotels')
const {StatusCodes} = require('http-status-codes')


const createRoom = async (req, res) => {
    try {
        req.body.createdBy = req.user.userId
        const {user: {userId}, params: {hotelId}, body: { roomNumber, bedrooms, floor,
            currency, room_cost_per_night, room_types, bed_type, view, images
         }} = req;
        // const { hotel } = req.params;

        const room = await Room.create({hotelId, roomNumber, bedrooms, floor,
            currency, room_cost_per_night, room_types, bed_type, view, images, createdBy: userId})

        // Add room to hotel's rooms array
        await Hotel.findByIdAndUpdate(hotelId, {$push: { rooms: room._id }})

        res.status(StatusCodes.CREATED).json({ message: 'Room added successfully', room })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error adding room', error });
    }

}

// Get all rooms for a specific hotel
const getAllRooms = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const rooms = await Room.find({ hotelId }).sort('-createdAt');
        res.status(StatusCodes.OK).json({ rooms })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching rooms', error });
    }
} 

const getSingleRoomByHotelId = async (req, res) => {
    try {
        const {user: {userId}, params: {hotelId, id: roomId}} = req.params

        // find hotel by hotel id
        const hotel = await Hotel.findById(hotelId).populate('rooms')
    
        if(!hotel) {
            throw new NotFountError(`No hotel with id ${hotelId}`)
        }
    
        // Find the room within the hotel's rooms array
        const room = hotel.rooms.id(roomId);
    
        if(!room) {
            throw new NotFountError(`Room with id: ${roomId} not found in hotel with id: ${hotelId}`)
        }
    
        res.status(StatusCodes.OK).json(room)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching rooms', error });
    }
}


// gets all rooms without hotelId
const getRooms = async (req, res) => {
    const rooms = await Room.find().sort('-createdAt')
    res.status(StatusCodes.OK).json({rooms})
}


// delete room by roomId
const deleteRoom = async (req, res) => {
    const {user: {userId}, 
        params: {id: roomId}} = req
    const room = await Room.findOneAndDelete({_id: roomId, 
        createdBy: userId})
    if(!room) {
        throw new NotFountError(`No hotel with id ${roomId}`)
    }
    res.status(StatusCodes.OK).send("hotel deleted")
}  

module.exports = {createRoom, getAllRooms, getSingleRoomByHotelId, deleteRoom, getRooms}