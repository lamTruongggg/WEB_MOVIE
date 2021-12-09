const mongoose = require('mongoose');
const UserSchema =  new mongoose.Schema({
    fullName:{
        type: String
    },
     email:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
     dob:{
        type:Date
    },
     sex:{
        type:String
    },
    phone:{
        type:String
    },
    isActive:{
        type: Number
    },
    pin:{
        type: String
    },
    dateCreate:{
        type:Date
    },
    dateUpdate:{
        type:Date
    }

});
const User =  mongoose.model('customers',UserSchema);
module.exports = User;