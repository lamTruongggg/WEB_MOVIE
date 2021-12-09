const mongoose = require('mongoose');
const UserSchema =  new mongoose.Schema({
    fullName:{
        type: String
    },
    name:{
        type:String
    }

});
const Director =  mongoose.model('directors',UserSchema);
module.exports = Director;