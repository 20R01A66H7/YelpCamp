const mongoose = require("mongoose");
const path = require("path");
const Campground = require("../models/campground");
const cities = require("./cities")
const {places, descriptors} = require("./seedHelpers");
const { default: axios } = require("axios");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp" );
const db = mongoose.connection;  // You can listen to database event using mongoose.connection
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
})
const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const price = Math.floor(Math.random()*20) +10;
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
          author: "649187de19b734f040735c68",
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
         
          description:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloremque distinctio officiis sed cupiditate culpa alias laudantium unde. Optio eum suscipit, commodi culpa adipisci reprehenderit perferendis soluta dolore quod unde perspiciatis!",
          price: price,
          geometry:{
              type:"Point",
              coordinates:[
                cities[random1000].longitude,
                cities[random1000].latitude
              ]
              },
          images: [
            {
              url: 'https://res.cloudinary.com/drotowtid/image/upload/v1687509138/YelpCamp/smhe7jpq5ibgnr5mart0.jpg',
              filename: 'YelpCamp/smhe7jpq5ibgnr5mart0',
             
            },
            {
              url: 'https://res.cloudinary.com/drotowtid/image/upload/v1687509138/YelpCamp/mpopx43ujyjzg30memgs.jpg',
              filename: 'YelpCamp/mpopx43ujyjzg30memgs',
              
            }
          ]
          
        });
        await camp.save();
    }
}
seedDB().then(()=>{
    console.log("closing connection")
    mongoose.connection.close()
});