const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({

    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    hotelId: {type: mongoose.Schema.Types.ObjectId, ref: 'Hotel'},
    roomNumber: {
        type: Number,
        required: true,
    },
    bedrooms: {
        type: Number,
        required: true,
    },
    floor: {
        type: String,
        required: [true, 'Please provide the floor']
    },
    currency: {
        type: String, 
        default: 'USD'
    },
    room_cost_per_night: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        // required: [true, 'Please provide user']
    },
    room_types: {
        type: String,
        enum: ["Standart", "Delux"],
        default: "Standart",
    },
    bed_type: {
        type: String,
        enum: ["Queen", "Full", "California", "King"],
        default: "Queen",
    },
    view: {
        type: String,
        enum: ["city", "ocean", "lake"], // Corrected "okean" to "ocean"
        default: "city"
    },
    images: [
        {
            url: {
                type: String,
                required: [true, 'Please provide url for images']
            },
            description: String,
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);




// const mongoose = require('mongoose')
// const Hotel = require('./hotels')
// const { required, ref } = require('joi')

// const RoomSchema = new mongoose.Schema({
//     roomNumber: {
//         type: Number,
//         required: true,
//         unique: true
//     },
//     bedrooms: {
//         type: Number,
//         required: true,
//     },
//     hotel: {
//         type: mongoose.Schema.Types.ObjectId, ref: 'Hotel',
//         required: [true, 'Please provide the floor'],
//      },
//     floor: {
//         type: String,
//         required: [true, 'Please provide the floor']
//     },
//     currency: {
//         type: String, 
//         default: 'USD'
//     },
//     room_cost_per_night: {
//         type: mongoose.Types.Decimal128,
//         required: true,
//     }, 
//     createdBy: {
//         type: mongoose.Types.ObjectId,
//         ref: 'User',
//         required: [true, 'Please provide user']
//     },
//     room_types: {
//         type: String,
//         enum: ["Standart", "Delux"],
//         default: "Standart",
//     },
//     bed_type: {
//         type: String,
//         enum: ["Queen", "Full", "California", "King"],
//         default: "Queen",
//     },
//     view: {
//         type: String,
//         enum: ["city", "okean", "lake", ],
//         default: "city"
//     },
//     images: [
//         {
//             url: {
//                 type: String,
//                 required: [true, 'Please provide url for images']
//             },
//             description: String,
//         }
//     ]

// },
// { timestamps: true }
// )

// module.exports = mongoose.model('Room', RoomSchema)