const express = require("express");
const router = express.Router({mergeParams:true});
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/reviews");
const {isLoggedIn,reviewValidate,isReviewAuthor} = require("../middleware");
const reviews = require("../controllers/reviews");


router.post("/",isLoggedIn, reviewValidate, catchAsync(reviews.postReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;