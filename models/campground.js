const mongoose = require("mongoose");
const { campgroundSchema } = require("../schemas");
const Review = require("./reviews");
const Schema = mongoose.Schema;

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title:String,
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    price:Number,
    description:String,
    location:String,
    images:[ ImageSchema ],
    author:{
      type:Schema.Types.ObjectId,
      ref:'User'
    },
    reviews:
    [{
        type:Schema.Types.ObjectId, 
        ref:'Review'
    }]
}, opts)


CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/campground/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`
});


CampgroundSchema.post("findOneAndDelete", async (doc)=>{
  //In Mongoose middleware functions, the doc parameter refers to the document that the middleware is applied to.
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
})

const Campground = mongoose.model('Campground', CampgroundSchema) ;


module.exports = Campground;
