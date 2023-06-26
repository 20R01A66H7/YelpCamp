const Campground = require("./models/campground");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/reviews")

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        
        req.session.returnTo = req.originalUrl;
        req.flash("error","You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.validateCampground = (req,res,next)=>{
    const joiSchema = require("./schemas");

const {error} = joiSchema.campgroundSchema.validate(req.body)


if(error){
    const message = error.details.map(el=>el.message).join(",")
    throw new ExpressError(message, 400)
}
else{
    next();
}}

module.exports.isAuthor = async (req,res,next) =>{
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if(!camp.author._id.equals(req.user._id)){
        req.flash("error","You are not allowed to do that");
        return res.redirect(`/campground/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next) =>{
    const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)){
        req.flash("error","You are not allowed to do that");
        return res.redirect(`/campground/${id}`);
    }
    next();
}

module.exports.returnTo = (req,res,next)=>{
    
    if(req.session.returnTo){
    res.locals.returnTo = req.session.returnTo;
    }
    next();
} 

module.exports.reviewValidate = (req,res,next)=>{
    const joiSchema = require("./schemas");

const {error} = joiSchema.reviewSchema.validate(req.body)


if(error){
    const message = error.details.map(el=>el.message).join(",")
    throw new ExpressError(message, 400)
}
else{
    next();
}}