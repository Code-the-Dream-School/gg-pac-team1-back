const mongoose = require('mongoose')

const CarSchema = new mongoose.Schema({
    carName: {
        type: String,
        required: [true, 'Please provide car name'],
        maxlength: [50, 'Name can not be more than 50 characters'],
    },
    make: {
        type: String
    },
    model: {
        type: String,
    },
    year: {
        type: String,
        required: [true, 'Please provide car year']
    },
    color: {
        type: String,
    }

})

module.exports = mongoose.model('Car', CarSchema)