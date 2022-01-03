const mongoose = require('mongoose');
const UserSchema =  new mongoose.Schema({   
        idBill : {
            type:String        
            },
              seller :{
                   type:String
              },                      
              buyer : { 
                   type:String
              },
              fname :{
                   type:String
              },
              lname :{
                   type:String
              },
                recipient_name : {
                       type:String
                },
              line1 :{
                   type:String
              },
              city : {
                   type:String
              },
              state :{
                type:String
              },
              postal_code : {
                   type:String
              },
              country_code : {
                   type:String
              },
               total :{
                type:Number
            },
             fee_payment : {
                 type:Number
             },
             subTotal:{
                 type:Number
             },
              status :{
                   type:String
             },
             dateCreate :{
                   type:Date
             },
             dateUpdate :{
                   type:Date
             }, 

});
const Transaction =  mongoose.model('transactions',UserSchema);
module.exports = Transaction;