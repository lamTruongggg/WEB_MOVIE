const mongoose = require('mongoose');
const UserSchema =  new mongoose.Schema({
    name:{
        type: String
    }

});
const Person =  mongoose.model('persons',UserSchema);
module.exports = Person;