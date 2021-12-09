const mongoose = require('mongoose');
const UserSchema =  new mongoose.Schema({
    name:{
        type: String
    }

});
const Rated =  mongoose.model('rateds',UserSchema);
module.exports = Rated;