const express = require("express");
const mongoose = require("mongoose");
const {campgroundSchema , reviewSchema} = require("./schemas.js")
const ejsMate = require("ejs-mate");
const catchAsync = require("./utility/catchAsync")
const expressError = require("./utility/expressError")
const path = require("path");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const campground = require("./models/campground");
const Review = require('./models/review');

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

const validateCampground = (req,res,next) => {
  const {error} = campgroundSchema.validate(req.body)
  if(error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new expressError(msg , 400)
  } else {
    next()
  }
}

const validateReview = (req,res,next) => {
  const {error} = reviewSchema.validate(req.body)
  if(error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new expressError(msg , 400)
  } else {
    next()
  }
}

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", catchAsync(async (req, res) => {
  const campgrounds = await Campground.find();
  res.render("campground/index", { campgrounds });
}));

app.get("/campgrounds/new", (req, res) => {
  res.render("campground/new");
});

app.post("/campgrounds", validateCampground , catchAsync(async (req, res , next) => { 
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get("/campgrounds/:id", catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews');
  res.render("campground/show", { campground });
}));

app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campground/edit", { campground });
}));

app.put("/campgrounds/:id", validateCampground ,  catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
}));

app.post("/campgrounds/:id/reviews" , validateReview , catchAsync(async (req,res) => {
  const campground = await Campground.findById(req.params.id)
  const review = new Review(req.body.review)
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`);
}))

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
