const express = require("express");
const router = express.Router();
const catchAsync = require("../utility/catchAsync")
const expressError = require("../utility/expressError")
const {campgroundSchema} = require("../schemas.js")
const Campground = require("../models/campground");

const validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body)
    if(error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new expressError(msg , 400)
    } else {
      next()
    }
  }

router.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campground/index", { campgrounds });
  })
);

router.get("/campgrounds/new", (req, res) => {
  res.render("campground/new");
});

router.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    res.render("campground/show", { campground });
  })
);

router.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    res.render("campground/edit", { campground });
  })
);

router.put(
  "/campgrounds/:id",
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted a campground!');
    res.redirect("/campgrounds");
  })
);

module.exports = router;
