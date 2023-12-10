const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require('../models/campground')

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.once("error", console.error.bind(console, "connection error:"));
db.on("open", () => {
  console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany()
  for(let i = 0 ; i < 50 ; i++) {
    const random = Math.floor(Math.random() * 50)
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
        location: `${cities[random].city} , ${cities[random].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        image: `https://loremflickr.com/300/300/woods?random=${i}`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat itaque ad iure ab nobis iusto, quia doloribus nulla tempora corrupti nam voluptates fugit dolores similique blanditiis facilis numquam repellat sit.',
        price
    })
    await camp.save()
  }
};

seedDB().then(() =>{
    mongoose.connection.close()
})
