if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
app.use(methodOverride("_method"));
const ExpressError = require("./utils/ExpressError");
const ejsMate = require("ejs-mate");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));

const dbUrl = process.env.DB_URL;
// const dbUrl = "mongodb://127.0.0.1:27017/yelp-camp"
mongoose.connect(dbUrl);

const db = mongoose.connection;  // You can listen to database event using mongoose.connection
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
})
const User = require("./models/user");
const passport = require("passport");
const localStrategy = require("passport-local");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");


const session = require("express-session");
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
app.use(session({
    // name:"jdfhzgl",
    store,
    secret:"thisismysecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}))
const flash = require("connect-flash");

app.use(flash());

app.use(mongoSanitize());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/drotowtid/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
passport.use(new localStrategy(User.authenticate())); //.authenticate() is an static mongo method automatically added by the passportLocalMongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/review");

app.use("/", userRoutes);
app.use("/campground", campgroundRoutes);
app.use("/campground/:id/reviews",reviewRoutes);



app.get("/", (req,res)=>{
    res.render("home");
})

app.all("*",(req,res,next)=>{
    next(new ExpressError("page not found", 404))
})

app.use((err, req, res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = "oh something went wrong";
    res.status(statusCode).render("error",{ err });
    // res.send("Error invalid or please try again later");
})

app.listen(3001, ()=>{
    console.log("listening on port 3001");
})