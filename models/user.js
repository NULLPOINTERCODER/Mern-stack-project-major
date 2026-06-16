const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Import the plugin function correctly – newer versions export it as a named property.
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
});
userSchema.plugin(passportLocalMongoose);
    
module.exports = mongoose.model("User", userSchema);