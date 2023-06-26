const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const {isLoggedIn,isAuthor,validateCampground} = require("../middleware.js");
const { populate } = require("../models/reviews");
const campground = require("../controllers/campground");
const {storage} = require("../cloudinary"); //node automaticallly looks for index.js file
const multer = require("multer");
const upload = multer({storage});

router.get("/", catchAsync(campground.index));

router.get("/new", isLoggedIn ,campground.newCampground);

router.get("/:id", catchAsync(campground.showCampground));

router.post("/", isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.postCampground));

router.get("/:id/edit", isLoggedIn,isAuthor,catchAsync(campground.editCampground));

router.put("/:id", isLoggedIn,validateCampground,isAuthor,catchAsync(campground.putEditCampground));

router.delete("/:id",isLoggedIn, isAuthor,catchAsync(campground.deleteCampground));

module.exports = router;