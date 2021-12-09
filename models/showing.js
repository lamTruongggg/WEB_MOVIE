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
    dateEnd:{
        type:Date
    },
    cinema:{
        type:String
    },
    static:{
        type:Number
    }

});
const Showing =  mongoose.model('showings',UserSchema);
module.exports = Showing;