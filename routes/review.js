const express = require('express')
const router = express.Router()
const catchAsync = require("../utility/catchAsync")
const expressError = require("../utility/expressError")
const Review = require('../models/review');
const Campground = require("../models/campground");
const {reviewSchema} = require("../schemas.js")


const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new expressError(msg , 400)
    } else {
      next()
    }
  }

router.post("/campgrounds/:id/reviews" , validateReview , catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))
  
router.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))
  

module.exports = router