const mongoose = require('mongoose');
const UserSchema =  new mongoose.Schema({
    fullName:{
        type: String
    },
     description:{
        type:String
    },
    genre:{
        type:String,
    },
     timing:{
        type:Number
    },
    country:{
        type:String
    },
    isActive:{
        type: Number
    },
    image:{
        type: String
    },
    video:{
        type:String
    },
    rated:{
        type: String
    },
    dateCreate:{
        type:Date
    },
    dateUpdate:{
        type:Date
    }

});
const Movie =  mongoose.model('movies',UserSchema);
module.exports = Movie;