const {NotFountError, BadRequestError} = require('../errors/errors')
const Booking = require('../models/booking')
const Room = require('../models/rooms')
const {StatusCodes} = require('http-status-codes')


const createBooking = async (req, res) => {
    try {
        req.body.createdBy = req.user.userId
        const { roomId } = req.params;
        const { checkInDate, checkOutDate, available, booked, guests, currency,
            price, guest_count, guestName, guestEmail } = req.body;
        // Find the room
        const room = await Room.findById(roomId)

        // check if the room is available for the requested dates
        const isAvailable = room.bookings.every(booking => 
        (checkOutDate <= booking.checkInDate || checkInDate >= booking.checkOutDate)
        ); 

        if(!isAvailable) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Room is not available for the selected dates.' });
        }

        // adding the booking to the room's booking array
        room.bookings.push({ checkInDate, checkOutDate, available, booked, guests, currency,
            price, guest_count, guestName, guestEmail })
        await room.save();    

        res.status(StatusCodes.CREATED).json({ booking })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating booking', error });
    }

}


// get bookings for a specific room
const getBookingsByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId);
        res.status(StatusCodes.OK).json(room.bookings);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching bookings', error });
    }
}


module.exports =  {getBookingsByRoom, createBooking}