const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const expressError = require("./utility/expressError")
const path = require("path");
const methodOverride = require("method-override");
const campgroundRoutes = require('./routes/campground.js')
const reviewRoutes = require('./routes/review.js')

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.once("error", console.error.bind(console, "connection error:"));
db.on("open", () => {
  console.log("Database Connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use('/' , campgroundRoutes)
app.use('/' , reviewRoutes)

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*" , (req,res,next) => {
  next(new expressError("Page not found" , 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log("Server running on Port 3000");
});
