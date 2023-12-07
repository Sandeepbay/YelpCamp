const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const Campground = require("./models/campground");
const campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.once("error", console.error.bind(console, "connection error:"));
db.on("open", () => {
  console.log("Database Connected");
});

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds" , async (req,res) => {
    const campgrounds = await Campground.find()
    res.render("campground/index" , {campgrounds})
})

app.get("/campgrounds/new" , (req,res) => {
    res.render("campground/new")
})

app.post("/campgrounds" , async (req,res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get("/campgrounds/:id" , async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campground/show" , {campground})
})

app.get("/campgrounds/:id/edit" , async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campground/edit" , {campground})
})

app.put("/campgrounds/:id" , async (req,res) => {
    const {id} = req.params
    const campground  = await Campground.findByIdAndUpdate(id , {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete("/campgrounds/:id" , async (req,res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
})

app.listen(3000, () => {
  console.log("Server running on Port 3000");
});
