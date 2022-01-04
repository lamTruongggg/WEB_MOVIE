const mongoose = require('mongoose');
const UserSchema =  new mongoose.Schema({
    fullName:{
        type: String
    },
    name:{
        type:String
    },
    author:{
        type:String
    },
    dateCreate:{
        type:String
    },
    time:{
        type:String
    },
    text:{
        type:String
    },
    like:{
        type:Number
    },
    dislike:{
        type:Number
    }

});
const Comments =  mongoose.model('comments',UserSchema);
module.exports = Comments;