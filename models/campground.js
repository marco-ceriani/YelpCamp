var mongoose = require('mongoose'),
    Comment = require('./comment')

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
})

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    createdAt: { type: Date, default: Date.now },
    location: {
        type: {
            textual: String,
            geo: pointSchema
        },
        required: false
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})
var Campground = mongoose.model('Campground', campgroundSchema)

module.exports = Campground
