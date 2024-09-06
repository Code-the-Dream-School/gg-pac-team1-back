const mongoose = require('mongoose')

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide hotel name'],
        maxlength: [50, 'Name can not be more than 50 characters'],
    },
    state: {
        type: String,
        required: [true, 'Please provide state'],
        maxlength: [50, 'Name can not be more than 50 characters'],
    },
    city: {
        type: String,
        required: [true, 'Please provide city'],
        maxlength: [50, 'Name can not be more than 50 characters'],
    },
    street: {
        type: String,
        required: [true, 'Please provide street']
    },
    zipCode: {
        type: String,
        required: [true, 'Please provide zip code'],
        maxlength: [5, 'Zip-code can not be more than 5 characters']
    },
    brand: {
        type: String,
        maxlength: [50, 'Name can not be more than 50 characters'],
    },
    stars: {
        type: Number,
        required: [true, 'Please provide stars for hotel'],
        maxlength: [1, 'Name can not be more than 1 characters'],
    },
    latitude: {
        type: String,
        required: [true, 'Please provide latitude of hotel'],
        maxlength: 12,
    },
    longitude: {
        type: String,
        required: [true, 'Please provide longitude of hotel'],
        maxlength: 12,
    },
    chain: {
        type: String,
        maxlength: [50, 'Name can not be more than 50 characters'],
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    },
    wifi: {
        type: Boolean, 
        required: [true, 'Please provide the wifi availablity']
    },
    okeanView: {
        type: Boolean, 
        required: [true, 'Please provide the okean view availablity']
    },
    pool: {
        type: Boolean,
        required: [true, 'Please provide the pool availablity']
    },
    gym: {
        type: Boolean,
        required: [true, 'Please provide the gym availablity']
    },
    spa: {
        type: Boolean,
        required: [true, 'Please provide the spa availablity']
    },
    parking: {
        aviability: {
            type: Boolean,
            required: [true, 'Please provide the restaurant availablity']
        },
        cost_per_day: {
            type: Number,
            required: [true, 'Please provide the cost per day for parking']
        }
    },
    restaurant: {
        type: Boolean,
        required: [true, 'Please provide the restaurant availablity']
    },
    image: [
        {url: {
            type: String,
            required: [true, 'Please provide the url of image']
        },
        description: String,
    }],
    galeryImage: [
        {
            url: {
                type: String,
                required: [true, 'Please provide url for galery images']
            },
            description: String,
        }
    ],
    languages_spoken: {
        type: [String],
        required: [true, 'Please provide the language spoken']
    },
    cancelation_policy: {
        type: String,
        required: [true, 'Please provide the cancelation policy for hotel']
    },
    rating: {
        type: Number,
        required: [true, 'Please provide the rating of hotel'],
        min: 0,
        max: 5,
    },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room'}]
    
},{ timestamps: true }
)

module.exports = mongoose.model('Hotel', HotelSchema)