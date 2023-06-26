const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose);         //A plugin in a schema in MongoDB is a way 
                //to create reusable logic for multiple schemas. The **Mongoose Schema API.
                //prototype.plugin()** method is used on the Schema object to create plugins for the schema¹.
                // With the help of plugins, you can use the same logic for multiple schemas¹.


module.exports = mongoose.model("User",userSchema);
