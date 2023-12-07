const mongoose = require('mongoose')
const Schema = mongoose.Schema // check if this line is correct or not

const CampgroundSchema = new Schema({
    title: String,
    price: String,
    location: String,
    description: String,
})

module.exports = mongoose.model('Campground' , CampgroundSchema)