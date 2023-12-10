const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    location: String,
    description: String,
    image: String
})

module.exports = mongoose.model('Campground' , CampgroundSchema)