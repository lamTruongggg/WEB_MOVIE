const mongoose = require('mongoose');
const UserSchema =  new mongoose.Schema({
    fullName:{
        type: String
    },
    name:{
        type:String
    },
    seat:{
        type:Number
    },
    hell:{
        type:String
    },
    static:{
        type:Number
    },
    image:{
        type:String
    },
    price:{
        type:Number
    },
    idshowing:{
        type:String
    },
    dateStart:{
        type:Date
    },
    time:{
        type:String
    }

});
const Cart =  mongoose.model('carts',UserSchema);
module.exports = Cart;