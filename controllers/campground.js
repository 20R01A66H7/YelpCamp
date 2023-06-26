const Campground = require("../models/campground");
const {cloudinary} = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_KEY
const geocoder = mbxGeocoding({accessToken:mapBoxToken});


module.exports.index = async (req,res)=>{
    const campgrounds= await Campground.find({});

    res.render("campgrounds/index", {campgrounds});
}

module.exports.newCampground = (req,res)=>{
    res.render("campgrounds/form");
}

module.exports.showCampground = async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
    path:'reviews',
    populate:{
        path:'author'
    }
    }).populate("author");
    if(!campground){
        req.flash("error","The campground you are searching for is deleted");
        res.redirect("/campground");
    }
   
    res.render("campgrounds/show", {campground})
}

module.exports.postCampground = async (req,res)=>{
    const geoData = await geocoder.forwardGeocode({
        query:req.body.location,
        limit:1
    }).send()

    // console.log(geoData.body.features[0].geometry.coordinates);
    // res.send("ok fine");
    
    const { price } = parseInt(req.body.price)
    const camp = new Campground({title:req.body.title, location:req.body.location, price: parseInt(req.body.price), description: req.body.description});
    camp.geometry = geoData.body.features[0].geometry;
    camp.images=req.files.map((f)=>(

        {url:f.path,filename:f.filename}

        ))
    camp.author = req.user._id;
    
    await camp.save();
    console.log(camp);
    res.redirect(`/campground/${camp._id}`);
}

module.exports.editCampground = async (req,res)=>{
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit", { camp });
}

module.exports.putEditCampground = async (req,res)=>{
    const { id } = req.params;
    // console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body });
    if(req.body.deleteImage){
        for(let image of req.body.deleteImage){
            await cloudinary.uploader.destroy(image);
        }
    await campground.updateOne({$pull:{images:{filename:{$in: req.body.deleteImage}}}}); 
    console.log(campground); 
    }
    campground.save();
    req.flash("success",'Successfully updated this campground!');
    res.redirect(`/campground/${campground._id}`)
}

module.exports.deleteCampground = async (req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campground");
}