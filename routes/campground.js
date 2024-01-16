const express = require("express");
const router = express.Router();
const catchAsync = require("../utility/catchAsync")
const { isLoggedIn , isAuthor , validateCampground} = require('../middleware.js')
const campgrounds = require("../controllers/campground.js")

router.get("/campgrounds", catchAsync(campgrounds.index));

router.get("/campgrounds/new", isLoggedIn , campgrounds.renderNewForm);

router.post("/campgrounds", isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get("/campgrounds/:id", catchAsync(campgrounds.showCampground));

router.get("/campgrounds/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put("/campgrounds/:id", 
  isLoggedIn, 
  isAuthor, 
  validateCampground, 
  catchAsync(campgrounds.updateCampground)
);

router.delete("/campgrounds/:id", isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
