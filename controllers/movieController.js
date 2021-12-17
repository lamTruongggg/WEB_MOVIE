const express =  require('express');
const userModel = require('../models/user');
const movieModel =  require('../models/movie');
const genreModel = require('../models/genre');
const countryModel = require('../models/country');
const ratedModel = require('../models/rated');
const personModel = require('../models/person');
const showingModel = require('../models/showing')
const cartModel = require('../models/cart');
const billModel = require('../models/bill');
const directorModel = require('../models/director');
const cinemaModel = require('../models/cinema');
const actorModel = require('../models/actor');
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
app.get('/',isAuth,(req,res)=>{
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
app.post('/checkpin',isAuth, async(req,res)=>{
    const email = req.session.email; console.log(req.body);
    const bill = billModel(req.body);
    bill.fullName= email;
    bill.dateCreate = new Date();
    bill.dateUpdate =  new Date();
    bill.static = 0;
 const rand = makeid(24);
    bill.pin=rand;
     const host=req.get('host');
    const link="http://"+req.get('host')+"/Movies/verify/"+rand;
    const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "webcardbank74@gmail.com",
        pass: "card@!1234"
    }
});
    const msg ={
          to:email,    
    subject:"Please confirm your Email account",
    html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>",
    }
    console.log(msg);
    smtpTransport.sendMail(msg,function(err,info){
if(err)
{console.log("email not send"); res.redirect('/Error');}
else
{ bill.save();console.log("email sended"); res.redirect('/');};
    });
   
});
app.get('/verify/:id',async(req,res)=>{
    try{
        const bill = await billModel.findOne({pin:req.params.id});
        const cart = await cartModel.find({name:bill.fullName});
          billModel.findOneAndUpdate({pin:req.params.id},{ $set: { "static": 1}},{new:true},(err,bill)=>{
            if(err)
            res.redirect('/Error');
        });
        cartModel.updateMany({name:bill.fullName},{ $set: { "static": 1}},{new:true},(err,cart)=>{
            if(err)
            res.redirect('/Error');
        });
        res.redirect('/');
        //res.status(200).send();
    }
    catch(error)
    {
        res.status(500).send(error);
    }
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