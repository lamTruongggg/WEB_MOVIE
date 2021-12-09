const mongoose = require('mongoose');
const UserSchema =  new mongoose.Schema({
    fullName:{
        type: String
    },
    name:{
        type:String
    }

});
const Actor =  mongoose.model('actors',UserSchema);
module.exports = Actor;