const { required } = require('joi')
const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
    checkInDate: {
        type: Date, 
        required: [true, 'Please provide the date of checking'],
    },
    checkOutDate: {
        type: Date, 
        required: [true, 'Please provide the date of checking'],
    },
    available: {
        type: Boolean,
        default: false,
    },
    booked: {
        type: Boolean,
        required: [true, 'Please provide the date of checking']
    },
    guests: {
        adults: {
            type: Number,
            max: 4,
            min: 1
        },
        children: {
            type: Number,
            max: 5,
            min: 0
        },
        children_ages: {
            types: [Number]
        }
    },
    currency: {
        type: String, 
        default: 'USD'
    },
    price: {
        type: mongoose.Types.Decimal128
    }, 
    guest_count: {
        type: Number, 
        required: [true, 'Please provide the floor'],
        default: 0,
    }, 
    guestEmail: {
        type: String,
        required: [true, "Please insert email"],
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Please insert valid email",
        ],
    },
    guestName: {
        type: String,
        required: [true, 'Please provide the guest name'],
    },
    room: {type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room',
        required: [true, 'Please provide the room id'],
    },
    hotel: {type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hotel',
        required: [true, 'Please provide the hotel id'],
    },
},{ timestamps: true }
)

module.exports = mongoose.model('Booking', BookingSchema)