const mongoose = require('mongoose');
const UserSchema =  new mongoose.Schema({
    fullName:{
        type: String
    },
    price:{
        type:Number
    },
    dateStart:{
        type: Date
    },
    cinema:{
        type:String
    },
    static:{
        type:Number
    },
    time:{
        type:String
    }

});
const Showing =  mongoose.model('showings',UserSchema);
module.exports = Showing;