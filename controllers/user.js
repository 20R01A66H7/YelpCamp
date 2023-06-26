const User = require("../models/user");



module.exports.register = (req,res)=>{
    res.render("campgrounds/register");
}

module.exports.postRegister = async (req,res)=>{
    try{
    const {email,username,password} = req.body;
    const user = new User({email,username});
    const newUser = await User.register(user,password);
    await user.save();
    req.login(newUser,function(err){
        if(err){
            return next(err);
        }
        req.flash("success", " welcome to campgrounds ");
        res.redirect("/campground");
    })
    
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/register");
    }
}

module.exports.login = (req,res)=>{
    res.render("campgrounds/login");
}

module.exports.postLogin = (req, res) => {
    const redirectTo = res.locals.returnTo  || "/campground";
    req.flash("success","Welcome !!!");
    res.redirect(redirectTo);

}

module.exports.logout = (req,res)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        res.redirect("/campground");
    });
    
}
