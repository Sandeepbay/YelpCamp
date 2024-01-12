const express = require('express')
const router = express.Router()
const catchAsync = require("../utility/catchAsync")
const expressError = require("../utility/expressError")
const Review = require('../models/review');
const Campground = require("../models/campground")
const { validateReview } = require('../middleware.js')


router.post("/campgrounds/:id/reviews" , validateReview , catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created a new Review!');
    res.redirect(`/campgrounds/${campground._id}`)
}))
  
router.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted a Review!');
    res.redirect(`/campgrounds/${id}`);
}))
  

module.exports = router