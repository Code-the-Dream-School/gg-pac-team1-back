
const {NotFoundError, BadRequestError, ConflictError} = require('../errors/errors')
const Booking = require('../models/booking')
const Room = require('../models/rooms')
const {StatusCodes} = require('http-status-codes')


const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ createdBy: req.user.userId }).populate('roomId').sort("-createdAt");
        res.status(StatusCodes.OK).json({bookings})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching all bookings', error });
    }
}


const createBooking = async (req, res) => {
    try {
        req.body.createdBy = req.user.userId


        const { checkInDate, checkOutDate, guests, currency,
            price, guest_count, guestName, guestEmail, hotelId, roomId } = req.body;
        // Find the room
        const room = await Room.findById(roomId).lean()

        if(!room) {
            throw new NotFoundError(`No room with id ${room._id}`)
        }

        if (new Date(checkInDate) >= new Date(checkOutDate)) {
            throw new BadRequestError(`Check-out date must be after check-in date`); 
        }

        const isRoomAvailable = await Booking.find({
            roomId: room._id,
            $or: [
                { checkInDate: {$lt: new Date(checkOutDate) }, checkOutDate: { $gt: new Date(checkInDate) } }
            ]
        }).countDocuments() === 0;


        
        if (!isRoomAvailable) {
            throw new ConflictError('Room is not available for the selected dates');
        }

        const newBooking = await Booking.create({
            checkInDate, checkOutDate, available: false, booked: true, guests, 
            currency,price, guest_count, guestName, 
            guestEmail, hotelId, roomId: room._id, createdBy: req.body.createdBy
        })

        res.status(StatusCodes.OK).json({ message: 'Booking created successfully',
            booking: newBooking
         })

    } catch (error) {
        message = error.message
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error, message });

    }

}


// get bookings for a specific room
const getBookingsByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        const { user: {userId} } = req;
        
        const booking = await Booking.find({ roomId, createdBy: userId }).populate('roomId');

        if(!booking) {
            throw new NotFoundError('Booking not foud with provided roomId')
        }
        
        res.status(StatusCodes.OK).json(booking);


    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching bookings', error });
    }
}



const updateBooking = async (req, res) => {
    
    const { body, user: {userId}, params: { id: bookingId }} = req;

    const booking = await Booking.findByIdAndUpdate({
        _id: bookingId, createdBy: userId
    }, body, { new: true, runValidators: true })

    if(!booking) {
        throw new NotFoundError(`No booking with id ${bookingId}`)
    }

    res.status(StatusCodes.OK).json({ booking })
}

const deleteBookings = async (req, res) => {
    const {user: {userId}, params: {id: bookingId}} = req;

    const booking = Booking.findByIdAndDelete({ _id: bookingId, createdBy: userId })

    if(!booking) {
        throw new NotFoundError(`No booking with id ${bookingId}`)
    }
    
    res.status(StatusCodes.OK).json({ message: `booking with id: ${bookingId} deleted successfully!` })
}


module.exports =  {getAllBookings, getBookingsByRoom, createBooking, deleteBookings, updateBooking}

