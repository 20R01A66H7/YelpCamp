const express = require("express");
const router = express.Router({mergeParams:true});
const passport = require("passport");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const {returnTo} = require("../middleware");
const user = require("../controllers/user");


router.get("/register",user.register);

router.post("/register",catchAsync(user.postRegister));

router.get("/login", user.login);

router.post("/login", returnTo, passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),user.postLogin);

router.get("/logout",user.logout);

module.exports = router;
