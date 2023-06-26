const Review = require("../models/reviews");
const Campground = require("../models/campground");

module.exports.postReview = async (req,res)=>{
    req.flash("success",'Successfully review posted');
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save()
    await campground.save();
    res.redirect(`/campground/${req.params.id}`);
}

module.exports.deleteReview = async (req,res)=>{
    const {id,reviewId} = req.params;
    
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campground/${id}`)
}
