const mongoose = require('mongoose');
const UserSchema =  new mongoose.Schema({
    name:{
        type: String
    }

});
const Genre =  mongoose.model('genres',UserSchema);
module.exports = Genre;