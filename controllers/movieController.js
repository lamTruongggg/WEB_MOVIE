const express =  require('express');
const userModel = require('../models/user');
const movieModel =  require('../models/movie');
const genreModel = require('../models/genre');
const countryModel = require('../models/country');
const ratedModel = require('../models/rated');
const personModel = require('../models/person');
const showingModel = require('../models/showing')
const cartModel = require('../models/cart');
const billModel = require('../models/transaction');
const directorModel = require('../models/director');
const cinemaModel = require('../models/cinema');
const actorModel = require('../models/actor');
const paypal = require('paypal-rest-sdk');
const nodemailer = require("nodemailer");
const app = express();
const isAuth = (req,res, next)=>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect('/Users');
    }
}

const isAdmin = (req,res, next)=>{
    if(req.session.isAdmin){
        next();
    }else{
        res.redirect('/');
    }
}
app.get('/send',(req,res)=>{
    const rand = makeid(24);
     const host=req.get('host');
    const link="http://"+req.get('host')+"/verify/"+rand;
    const msg ={
          to:"webcardbank74@gmail.com",
    from:"webcardbank74@gmail.com",
    subject:"aaa",
    html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>",
    }
    sgMail.send(msg,function(err,info){
if(err)
{console.log("email not send");}
else
{console.log("email sended")};
    });
});
function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}
app.post('/showingMovie/add',isAdmin,isAuth,async(req,res)=>{
   const body = req.body;
   const showing = new showingModel(body);
   console.log(req.body);
   showing.static=0;
   try{
        showing.save();
        var i=1;
        var j=1;
        var a="a";
        var check = req.body.cinema;
        var x=6;
        if(check=="cinema A") x = 9;
                const info = await  showingModel.findOne({static:0});
        const id = info._id.toString();
        showingModel.findOneAndUpdate({_id:id},{ $set: { "static": 1}},{new:true},(err,showing)=>{
            if(err)
            res.redirect('/Error');
        });
        while(j<=6)
        {
            if(j==2) a="b";
            else if(j==3) a="c";
              else if(j==4) a="d";
                else if(j==5) a="e";
                  else if(j==6) a="f";
                  i=1;
        while(i<=x)
        {
            const cinema = new cinemaModel({fullName:id,name:showing.fullName,seat:i,hell:a,static:0,dateStart:showing.dateStart,time:showing.time});
            console.log(cinema);
            cinema.save();
            i++;
        };
        j++
    };
        res.redirect('/Movies/showingMovie');
}
catch(error)
    {
        res.status(500).send(error);
    }

});
app.post('/add',isAdmin,isAuth, async(req,res)=>{
     console.log(req.body);
    if(req.body.id =='')
    {
        addRecord(req,res);
    }
    else
    {
        updateRecord(req,res);
    }
});
/** 
app.get('/list',(req,res)=>{
    res.render('users/view-user.hbs',{viewTitle:"List User Information"}
    );
});
*/
app.get('/',isAdmin,isAuth,(req,res)=>{
    const email = req.session.email;   
    movieModel.find({}).then(movies =>{
        movies.dateCreate = new Date(movies.dateCreate);
    res.render('partials/listMovie.hbs',{
        movies: movies.map(movie => movie.toJSON()),
        query:email
    });
    })
});
app.get('/bookingMovie/:id',isAuth ,async(req,res)=>{
    const email = req.session.email;   
    const cinemas = await cinemaModel.find({fullName:req.params.id});
    const cinemass = await cinemaModel.findOne({fullName:req.params.id});
    const date =  await showingModel.find({fullName:cinemass.name}); 
    const showing = await showingModel.findOne({_id:req.params.id});
    res.render('partials/booking.hbs',{
        query: email,
        //cinema: cinemas.map(cinemas => cinemas.toJSON()),
        showing: showing.toJSON(),
        date:date.map(date => date.toJSON()),
        time:date.map(date => date.toJSON())
    });
});
app.post('/bookingMoviedate',isAuth, async(req,res)=>{
    const email = req.session.email;   console.log(req.body);
     const time = await showingModel.find({fullName:req.body.fullName,dateStart:req.body.dateStart});
      const date =  await showingModel.find({fullName:req.body.fullName}); 
         const showing = await showingModel.findOne({fullName:req.body.fullName});
         const cinemas = await cinemaModel.find({name:req.body.fullName});
       res.render('partials/booking.hbs',{
        query: email,
        //cinema: cinemas.map(cinemas => cinemas.toJSON()),
        showing: showing.toJSON(),
        date:date.map(date => date.toJSON()),
        time:time.map(time => time.toJSON()),
        dates:req.body.dateStart
    });
});
app.post('/bookingMovietime',isAuth, async(req,res)=>{
    const email = req.session.email;   console.log(req.body);
     const time = await showingModel.find({fullName:req.body.fullName,dateStart:req.body.dateStart});
      const date =  await showingModel.find({fullName:req.body.fullName}); 
         const showing = await showingModel.findOne({fullName:req.body.fullName});
         const cinemas = await cinemaModel.find({name:req.body.fullName,dateStart:req.body.dateStart,time:req.body.time});
       res.render('partials/booking.hbs',{
        query: email,
        cinema: cinemas.map(cinemas => cinemas.toJSON()),
        showing: showing.toJSON(),
        date:date.map(date => date.toJSON()),
        time:time.map(time => time.toJSON()),
        dates:req.body.dateStart,
        times:req.body.time
    });
});
app.get('/shoppingCart',isAuth, async(req,res)=>{
    const email = req.session.email;   
    const cart = await cartModel.find({name:email, static:0});
    const number = await cartModel.find({name:email,static:0}).count();   
    res.render('partials/shoppingCart.hbs',{
        carts: cart.map(cart => cart.toJSON()),
        numbers: number.toString(),
        query:email
    });
});
app.get('/historyCart',isAuth, async(req,res)=>{
    const email = req.session.email;   
    const cart = await cartModel.find({name:email, static:1});
    const number = await cartModel.find({name:email,static:1}).count();
    res.render('partials/cartMoney.hbs',{
        carts: cart.map(cart => cart.toJSON()),
        numbers: number.toString(),
        query:email
    });
});
app.get('/cartMoney',isAdmin,isAuth, async(req,res)=>{
    const email = req.session.email;   
    const cart = await cartModel.find({static:1});
    const number = await cartModel.find({static:1}).count();
    res.render('partials/cartMoney.hbs',{
        carts: cart.map(cart => cart.toJSON()),
        numbers: number.toString(),
        query:email
    });
});

    var total =0;
app.post('/checkpin',isAuth, async(req,res)=>{
    const email = req.session.email; console.log(req.body);
       const cart = await cartModel.find({name:email, static:0});
     var items =[];
    for (var i = 0; i < cart.length; i ++ ){
   items.push({name: cart[i].fullName + " - "+ cart[i].seat + " - " + cart[i].hell + " - "+cart[i].time,sku: (cart[i]._id).toString(),price: (cart[i].price).toString(),
    currency:"USD",
    quantity: "1"});
    }
    console.log(items);
    total = req.body.totalMoney;
    paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AW1T5-R2qJvdLXBKK4qTYT4urvBIuvmunzyBNoG5Ud2pFEnjsmg8BnWqFHv9Q5jQ1JLflIck0FL0xkbW',
  'client_secret':'EDCd6la-rJTRrZnurKGdyGzfnZLgxnOT3Th4PePCTGVKE66-Ios9rsBS7cIXQNX-F99l21UNqi_xpkOP'
  
});
const link="http://"+req.get('host')+"/Movies";
    var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": link+"/review_payment",
        "cancel_url": link+"/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": items
        },
        "amount": {
            "currency": "USD",
            "total": total.toString()
        },
        "description": "This is the payment description."
    }]
};
    paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
      }
    }
});
});
app.get('/review_payment',isAuth, (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  paypal.payment.get(paymentId, function (error, payment) {
    if (error) {
        console.log(error);
        throw error;
    } else {
        const email = payment.payer.payer_info.email;
        const name = payment.payer.payer_info.shipping_address.recipient_name;
        const code = payment.payer.payer_info.shipping_address.postal_code;
        const country = payment.payer.payer_info.shipping_address.country_code;
        const seller = "webcardbank74@gmail.com";
        res.render('partials/reviewPayment.hbs',{
        paymentId: paymentId,
        payerId:payerId,
        email:email,
        fname: payment.payer.payer_info.first_name,
        lname:payment.payer.payer_info.last_name,
        line1:payment.payer.payer_info.shipping_address.line1,
        city:payment.payer.payer_info.shipping_address.city,
        state:payment.payer.payer_info.shipping_address.state,
        name:name,
         code:code,
        country:country,
        seller:seller,
            query:req.session.email,
            admin:req.session.isAdmin,business:req.session.isBusiness
        });
    }

  
});
});

app.post('/checkBill',isAuth, async(req, res) => {
  const payerId = req.body.PayerID;
  const paymentId = req.body.paymentId;
           const rand = makeid(24);
                      req.session.random = rand; 
                                    const host=req.get('host');
                const link="http://"+req.get('host')+"/Movies/verifyAccount/"+rand+"?PayerID="+payerId+"&paymentId="+paymentId;
                const smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "webcardbank74@gmail.com",
                    pass: "card@!1234"
                }
            });
                const msg ={
                    to:req.session.email,    
                subject:"Please confirm for continue to PAY",
                html: "<div style='background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;'> <div style='display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;'></div> <table border='0' cellpadding='0' cellspacing='0' width='100%'> <tr> <td bgcolor='#FFA73B' align='center'> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'> <tr> <td align='center' valign='top' style='padding: 40px 10px 40px 10px;'> </td> </tr> </table> </td> </tr> <tr> <td bgcolor='#FFA73B' align='center' style='padding: 0px 10px 0px 10px;'> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'> <tr> <td bgcolor='#ffffff' align='center' valign='top' style='padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;'> <h1 style='font-size: 48px; font-weight: 400; margin: 2;'>Welcome!</h1> <img src=' https://img.icons8.com/clouds/100/000000/handshake.png' width='125' height='120' style='display: block; border: 0px;' /> </td> </tr> </table> </td> </tr> <tr> <td bgcolor='#f4f4f4' align='center' style='padding: 0px 10px 0px 10px;'> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'> <tr> <td bgcolor='#ffffff' align='left' style='padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'> <p style='margin: 0;'>We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p> </td> </tr> <tr> <td bgcolor='#ffffff' align='left'> <table width='100%' border='0' cellspacing='0' cellpadding='0'> <tr> <td bgcolor='#ffffff' align='center' style='padding: 20px 30px 60px 30px;'> <table border='0' cellspacing='0' cellpadding='0'> <tr> <td align='center' style='border-radius: 3px;' bgcolor='#FFA73B'><a href="+link+" target='_blank' style='font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;'>Confirm Account</a></td> </tr> </table> </td> </tr> </table> </td> </tr> <!-- COPY --> <tr> <td bgcolor='#ffffff' align='left' style='padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'> <p style='margin: 0;'>If that doesn't work, copy and paste the following link in your browser:</p> </td> </tr> <!-- COPY --> <tr> <td bgcolor='#ffffff' align='left' style='padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'> <p style='margin: 0;'><a href='#' target='_blank' style='color: #FFA73B;'>https://bit.li.utlddssdstueincx</a></p> </td> </tr> <tr> <td bgcolor='#ffffff' align='left' style='padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'> <p style='margin: 0;'>If you have any questions, just reply to this email—we're always happy to help out.</p> </td> </tr> <tr> <td bgcolor='#ffffff' align='left' style='padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'> <p style='margin: 0;'>Cheers,<br>BBB Team</p> </td> </tr> </table> </td> </tr> <tr> <td bgcolor='#f4f4f4' align='center' style='padding: 30px 10px 0px 10px;'> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'> <tr> <td bgcolor='#FFECD1' align='center' style='padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'> <h2 style='font-size: 20px; font-weight: 400; color: #111111; margin: 0;'>Need more help?</h2> <p style='margin: 0;'><a href='#' target='_blank' style='color: #FFA73B;'>We&rsquo;re here to help you out</a></p> </td> </tr> </table> </td> </tr> <tr> <td bgcolor='#f4f4f4' align='center' style='padding: 0px 10px 0px 10px;'> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'> <tr> <td bgcolor='#f4f4f4' align='left' style='padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;'> <br> <p style='margin: 0;'>If these emails get annoying, please feel free to <a href='#' target='_blank' style='color: #111111; font-weight: 700;'>unsubscribe</a>.</p> </td> </tr> </table> </td> </tr> </table> </div>",
                }
                smtpTransport.sendMail(msg,function(err,info){
            if(err)
            {console.log("email not send");}
            else
            {   console.log("email sended");
              return res.render('partials/note.hbs',{
       text:" Comfirm Payment. PLEASE CHECK YOUR GMAIL",
        query:req.session.email,admin:req.session.isAdmin,business:req.session.isBusiness
   });
            }
                });            
           
});
app.get('/verifyAccount/:id',isAuth,async(req,res)=>{
    try{
        const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
         const rand = req.session.random;
         delete req.session.random;
         if(rand == req.params.id)
         {
             res.redirect('/Movies/success?PayerID='+payerId+'&paymentId='+paymentId);
         }
         else{
             return res.render('partials/note.hbs',{
       text:"Payment Cancel. PLEASE CHECK YOUR CART AGAIN",
        query:req.session.email,admin:req.session.isAdmin,business:req.session.isBusiness
   });
         }
    }
    catch(error)
    {
        res.status(500).send(error);
    }
});
app.get('/success',isAuth, async(req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": total.toString()
        }
    }]
  };
  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
     res.render('partials/note.hbs',{
       text:"Payment Cancel. PLEASE CHECK YOUR CART AGAIN",
       query:req.session.email,admin:req.session.isAdmin,business:req.session.isBusiness
   });
    } 
            const fee = payment.transactions[0].related_resources;
            cartModel.find({name:req.session.email,static:0}).then(items=>{     
            const payerInfo = payment.payer.payer_info;        
             const shipping_address = payerInfo.shipping_address;         
             var subTotal = total - fee[0].sale.transaction_fee.value;
                const bill = new billModel();        
                 bill.total = total.toString();
              bill.seller = "webcardbank74@gmail.com";
             bill.dateCreate = payment.create_time;
             bill.dateUpdate = payment.update_time;
             bill.status = payment.payer.status;           
              bill.buyer = req.session.email;
              console.log(req.session.email);
              bill.fname = payerInfo.first_name;
              bill.lname = payerInfo.last_name;
                bill.recipient_name = shipping_address.recipient_name;
              bill.line1 =shipping_address.line1;
              bill.city = shipping_address.city;
              bill.state = shipping_address.state;
              bill.postal_code = shipping_address.postal_code;
              bill.country_code = shipping_address.country_code;
             bill.fee_payment = fee[0].sale.transaction_fee.value;
             bill.subTotal = subTotal;
             bill.save();
             console.log(bill);
                cartModel.updateMany({name:req.session.email, static:0},{$set:{"static":1, idBill:(bill._id).toString()}},{new:true},(err,cart)=>{ //thanh toan don hang cua khachhang tu chua thanh toan sang trang thai da thanh toan
               if(!cart){
                            return res.render('partials/note.hbs',{
                text:"Payment Cancel. PLEASE CHECK YOUR CART AGAIN",
                 query:req.session.email,admin:req.session.isAdmin,business:req.session.isBusiness
            });
               }
               else
               {
        res.render('partials/success.hbs',{
              total : total.toString(),
                items : items.map(items =>items.toJSON()),
              seller : "webcardbank74@gmail.com",
             dateCreate : payment.create_time,
             dateUpdate : payment.update_time,
             status : payment.payer.status,              
              email :  req.session.email,
              fname : payerInfo.first_name,
              lname : payerInfo.last_name,
                recipient_name : shipping_address.recipient_name,
              line1 :shipping_address.line1,
              city : shipping_address.city,
              state : shipping_address.state,
              postal_code : shipping_address.postal_code,
              country_code : shipping_address.country_code,
             fee_payment : fee[0].sale.transaction_fee.value,
             subTotal: subTotal,
             text: "Payment Done. Thank you for purchasing our products",
              query:req.session.email,admin:req.session.isAdmin,business:req.session.isBusiness
        });
    }
          });
          });
});
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
app.post('/addCart',isAuth, async(req,res)=>{
    const email = req.session.email;  
    const body = req.body;
    const cart = cartModel(body);
    console.log(req.body);
    const movie = await movieModel.findOne({fullName:req.body.fullName});
    const showing= await showingModel.findOne({_id:req.body.idshowing});
    cart.name= email;
    cart.static=0;
    cart.image= movie.image;
    cart.price = showing.price;

    try{
        cart.save();
        cinemaModel.findOneAndUpdate({seat:cart.seat,hell:cart.hell,fullName:cart.idshowing},{ $set: { "static": 1}},{new:true},(err,showing)=>{
            if(err)
            redirect('/Error');
        });
        res.redirect('/Movies/bookingMovie/'+req.body.idshowing);
    }catch(error)
    {
        res.status(500).send(error);
    }
});
app.get('/showingMovie',isAdmin,isAuth,async(req,res)=>{
    const email = req.session.email;   
    const error = req.session.error;
    delete req.session.error;
    var showing = await showingModel.find({});
    var movie = await movieModel.find({});
    res.render('partials/showingMovie.hbs',{
        query:email,
        showings: showing.map(showing => showing.toJSON()),
        movies: movie.map(movie => movie.toJSON()),
        error:error
    });
});
app.get('/listBill',isAuth,async(req,res)=>{
    const email = req.session.email;      
    var bill = await billModel.find({buyer:req.session.email});
    res.render('partials/listTransaction.hbs',{
        query:email,
        bills: bill.map(bill => bill.toJSON())
    });
});

app.get('/listBillManage',isAdmin,isAuth,async(req,res)=>{
    const email = req.session.email;      
    var bill = await billModel.find({});
    res.render('partials/listTransaction.hbs',{
        query:email,
        bills: bill.map(bill => bill.toJSON())
    });
});
app.get('/detailBill/:id',isAuth,async(req,res)=>{
    const email = req.session.email;      
    var bill = await billModel.findOne({_id:req.params.id});
    console.log(bill);
    var items = await cartModel.find({idBill:(bill._id).toString()});
    res.render('partials/success.hbs',{
        query:email,
        total : bill.total,
                items: items.map(items => items.toJSON()),
              seller : bill.seller,
             dateCreate : bill.dateCreate,
             dateUpdate : bill.dateUpdate,
             status : bill.status,              
              email : bill.buyer,
              fname : bill.fname,
              lname : bill.lname,
                recipient_name : bill.recipient_name,
              line1 :bill.line1,
              city : bill.city,
              state : bill.state,
              postal_code : bill.postal_code,
              country_code : bill.country_code,
             fee_payment : bill.fee_payment,
             subTotal: bill.subTotal,
             text: "Payment Infomation"
    });
});
function addRecord(req,res)
{
    const {fullName,description,timing,video,image,genre,country,rated,director,actor} = req.body;
    const movies =  new movieModel({fullName,description,timing,video,image,genre,country,rated});
    const actors = new actorModel({fullName,name:actor});
    const directors = new directorModel({fullName,name:director});
    var datetime = new Date(Date.now()).toISOString();
    movies.dateCreate= datetime;
    try{
        movieModel.findOne({fullName:movies.fullName}).then(movie=>{
        if(movie){
            req.session.error="The Movie already";
            res.redirect('/Movies');
        }   
        else{    
            movies.save();
            actors.save();
            directors.save();
            req.session.error="Insert Movie Successfull";
            res.redirect('/Movies')}
    })
    }catch(error)
    {
        res.status(500).send(error);
    }
}

function updateRecord(req,res)
{
    directorModel.findOneAndUpdate({"fullName":req.body.fullName},{ $set: { "name": req.body.director}},{new:true},(err,director)=>{
        if(err)
        redirect('/Error');
    });
    actorModel.findOneAndUpdate({"fullName":req.body.fullName},{ $set: { "name": req.body.actor}},{new:true},(err,actor)=>{
        if(err)
        redirect('/Error');
    });
     movieModel.findOneAndUpdate({_id:req.body.id},req.body,{new:true},(err,movie)=>{
        if(!err){
                res.redirect('/Movies');
            }
            else
            {
                console.log(err);
            }
        });
}
app.get('/edit/:id',isAdmin,isAuth, async(req,res)=>{
     var genre= await genreModel.find({});
    var country = await countryModel.find({});
    var rated =  await ratedModel.find({});
    var person = await personModel.find({});   
    const name = req.session.email; 
    var movie = await movieModel.findById(req.params.id);
             var director = await directorModel.findOne({fullName:movie.fullName});
             var actor = await  actorModel.findOne({fullName:movie.fullName});
             console.log(director);
            res.render('partials/movieForm.hbs',{
                  viewTitles: "Update New Movies",
                movie:movie.toJSON(),
                query:name,
                genre: genre.map(genre => genre.toJSON()),
         country: country.map(country => country.toJSON()),
         rated: rated.map(rated => rated.toJSON()),
         person: person.map(person => person.toJSON()),
         director:  director.toJSON(),
         actor: actor.toJSON()
            });
        
    
});
app.get('/delete/:id',isAdmin,isAuth,async(req,res)=>{
    try{
        const movie = await movieModel.findByIdAndDelete(req.params.id,req.body);
        if(!movie) res.redirect('partials/404.hbs');
        else
        res.redirect('/Movies');
        //res.status(200).send();
    }
    catch(error)
    {
        res.status(500).send(error);
    }
});
app.get('/showingMovie/delete/:id',isAdmin,isAuth,async(req,res)=>{
    try{
        const showing = await showingModel.findByIdAndDelete(req.params.id,req.body);
        const cinema = await cinemaModel.deleteMany({fullName:req.params.id})
        if(!showing || !cinema)  res.redirect('/Error');
        else
        res.redirect('/Movies/showingMovie');
        //res.status(200).send();
    }
    catch(error)
    {
        res.status(500).send(error);
    }
});
app.post('/shoppingCart/delete',isAuth,async(req,res)=>{
    console.log(req.body);
    try{
        const cart = await cartModel.findOneAndDelete({idshowing:req.body.fullName,seat:req.body.seat,hell:req.body.hell});
        cinemaModel.findOneAndUpdate({fullName:req.body.fullName,seat:req.body.seat,hell:req.body.hell},{ $set: { "static": 0}},{new:true},(err,showing)=>{
            if(err)
            redirect('/Error');
        });
        res.redirect('/Movies/shoppingCart');
        //res.status(200).send();
    }
    catch(error)
    {
        res.status(500).send(error);
    }
});
app.get('/add',isAdmin,isAuth, async(req,res)=>{   
    var genre= await genreModel.find({});
    var country = await countryModel.find({});
    var rated =  await ratedModel.find({});
    var person = await personModel.find({});
    const name = req.session.email;   
    const error = req.session.error;
    delete req.session.error;
     res.render('partials/movieForm.hbs',{
         viewTitles: "Insert New Movies",
         genre: genre.map(genre => genre.toJSON()),
         country: country.map(country => country.toJSON()),
         rated: rated.map(rated => rated.toJSON()),
         person: person.map(person => person.toJSON()),
         query:name,
         viewTitle: error
     });
});
app.use(express.static('views'));

module.exports = app;