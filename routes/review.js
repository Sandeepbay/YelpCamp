const express = require('express')
const router = express.Router()
const catchAsync = require("../utility/catchAsync")
const { validateReview , isLoggedIn , isReviewAuthor} = require('../middleware.js')
const reviews = require('../controllers/reviews.js')


router.post("/campgrounds/:id/reviews" , isLoggedIn , validateReview , catchAsync(reviews.createReview))
  
router.delete('/campgrounds/:id/reviews/:reviewId',
 isLoggedIn,
 isReviewAuthor,
 catchAsync(reviews.deleteReview)
)

module.exports = router