const mongoose = require('mongoose');
const UserSchema =  new mongoose.Schema({
    fullName:{
        type: String
    },
    totalMoney:{
        type:Number
    },
    dateCreate:{
        type:Date
    },
    dateUpdate:{
        type:Date
    },
    pin:{
        type:String
    },
    static:{
        type:Number
    }

});
const Bill =  mongoose.model('bills',UserSchema);
module.exports = Bill;