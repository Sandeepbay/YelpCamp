const express = require("express");
const router = express.Router();
const catchAsync = require("../utility/catchAsync")
const expressError = require("../utility/expressError")
const {campgroundSchema} = require("../schemas.js")
const Campground = require("../models/campground");
const { isLoggedIn , isAuthor , validateCampground} = require('../middleware.js')


router.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campground/index", { campgrounds });
  })
);

router.get("/campgrounds/new", isLoggedIn , (req, res) => {
  res.render("campground/new");
});

router.post(
  "/campgrounds",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews").populate('author');
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    res.render("campground/show", { campground });
  })
);

router.get(
  "/campgrounds/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    res.render("campground/edit", { campground });
  })
);

router.put(
  "/campgrounds/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success', 'Updated a campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/campgrounds/:id",
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted a campground!');
    res.redirect("/campgrounds");
  })
);

module.exports = router;
