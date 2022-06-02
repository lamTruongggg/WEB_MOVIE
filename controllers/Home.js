const express =  require('express');
const genreModel = require('../models/genre');
const countryModel = require('../models/country')
const path = require('path');
const ratedModel = require('../models/rated');
const cartModel = require('../models/cart');
const movieModel =  require('../models/movie');
const showingModel = require('../models/showing');
const userModel = require('../models/user');
const cinemaModel = require('../models/cinema');
const commentModel = require('../models/comment');
const { timeStamp } = require('console');
const app = express();
function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join(".");
}

const isAuth = (req,res, next)=>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect('/Users');
    }
}
app.get('/thanhcong',async(req,res)=>{
     const name = req.session.email;   
     res.render('partials/thanhcong.hbs',{
         query:name
    });
})
app.get('/',async(req,res)=>{
     const name = req.session.email;   
      var movie = await movieModel.find({}).sort({_id:-1}).limit(4);
       var movies = await movieModel.find({}).sort({_id:1}).limit(6);
        var moviess = await movieModel.find({}).sort({_id:-1}).limit(6);
     res.render('partials/main.hbs',{
         query:name,
         movieBanner:movie.map(movie => movie.toJSON()),
         movies:movies.map(movies => movies.toJSON()),
         movieEx:moviess.map(moviess => moviess.toJSON())
    });
});
app.get('/catalogGrid',async(req,res)=>{
     const name = req.session.email;   
       var genre= await genreModel.find({});
      var movie = await movieModel.find({});
    var country = await countryModel.find({});
    var rated =  await ratedModel.find({});
     res.render('partials/catalogGrid.hbs',{
         query:name,
         movieBanner:movie.map(movie => movie.toJSON()),
         genres: genre.map(genre => genre.toJSON()),
          countrys: country.map(country => country.toJSON()),
         rateds: rated.map(rated => rated.toJSON()),
    });
});
app.get('/catalogList',async(req,res)=>{
    const name = req.session.email;   
       var genre= await genreModel.find({});
      var movie = await movieModel.find({});
    var country = await countryModel.find({});
    var rated =  await ratedModel.find({});
     res.render('partials/catalogList.hbs',{
         query:name,
         movieBanner:movie.map(movie => movie.toJSON()),
         genres: genre.map(genre => genre.toJSON()),
          countrys: country.map(country => country.toJSON()),
         rateds: rated.map(rated => rated.toJSON()),
    });
});
app.post('/addComment',isAuth,async(req,res)=>{
   const user = await userModel.findOne({email:req.session.email});
   const comment = new commentModel(req.body);
   comment.name = user.fullName;
   const date = new Date();   
   comment.dateCreate = convert(date);
   const time = date.getMinutes();
   if(time<10) {comment.time = date.getHours() +":" +"0"+ (date.getMinutes()).toString();}
   else {comment.time =  date.getHours() +":" +(date.getMinutes()).toString();}
   comment.like = 0;
   comment.dislike = 0;
   comment.save();
   res.redirect('/detailMovie/'+req.body.fullName);

});
function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}
app.get('/detailMovie/:id',async(req,res)=>{
     const name = req.session.email;   
      var movie = await movieModel.findOne({fullName:req.params.id});
       var movieBanner = await movieModel.find({}).sort({_id:-1}).limit(6);      
       var showing = await showingModel.findOne({fullName:req.params.id}); 
       var check = null;
        if(req.session.email != null)
       check = await cartModel.findOne({name:req.session.email,static:1,fullName:req.params.id});
       try{
       if(showing)
       {
           if(check)
           {
           const comment = await commentModel.find({fullName:req.params.id});
     res.render('partials/detailMovie.hbs',{
         query:name,
         movies: movie.toJSON(),
          movieBanner:movieBanner.map(movie => movie.toJSON()),
          showing: showing.toJSON(),
            check: check.toJSON(),
            comment: comment.map(comment => comment.toJSON())
    });
       }
       else
       {
            res.render('partials/detailMovie.hbs',{
         query:name,
         movies: movie.toJSON(),
          movieBanner:movieBanner.map(movie => movie.toJSON()),
          showing: showing.toJSON()
            });
       }
    }
    else
    {
         res.render('partials/detailMovie.hbs',{
         query:name,
         movies: movie.toJSON(),
          movieBanner:movieBanner.map(movie => movie.toJSON())
    });
    }}
    catch(error)
    {
          res.status(500).send(error);
        res.redirect('/Error');
    }
});
app.post('/catalogGridFilter',async(req,res)=>{
    const name = req.session.email;   
   const genres = req.body.genre;
   const countrys = req.body.country;
   const rateds = req.body.rated;
   var movie ;
   if(genres !="All" && countrys == "All" && rateds == "All")
   {
   movie = await movieModel.find({genre:req.body.genre});
    }else if(genres =="All" && countrys != "All" && rateds == "All")
   {
   movie = await movieModel.find({country:req.body.country});
    }else if(genres =="All" && countrys == "All" && rateds != "All")
   {
   movie = await movieModel.find({rated:req.body.rated});
    }else if(genres !="All" && countrys != "All" && rateds == "All")
   {
   movie = await movieModel.find({genre:req.body.genre,country:req.body.country});
    }else if(genres !="All" && countrys == "All" && rateds != "All")
   {
   movie = await movieModel.find({genre:req.body.genre,rated:req.body.rated});
    }else if(genres =="All" && countrys != "All" && rateds != "All")
   {
   movie = await movieModel.find({country:req.body.country, rated:req.body.rated});
    }else    
    movie = await movieModel.find({}); 
    if(!movie)
    {
        req.redirect('/catalogGrid');
    }
var genre= await genreModel.find({});
 var country = await countryModel.find({});
 var rated =  await ratedModel.find({});
  res.render('partials/catalogGrid.hbs',{
      query:name,
      movieBanner:movie.map(movie => movie.toJSON()),
      genres: genre.map(genre => genre.toJSON()),
       countrys: country.map(country => country.toJSON()),
      rateds: rated.map(rated => rated.toJSON()),
 });
});

app.post('/catalogListFilter',async(req,res)=>{
    const name = req.session.email;   
   const genres = req.body.genre;
   const countrys = req.body.country;
   const rateds = req.body.rated;
   var movie ;
   if(genres !="All" && countrys == "All" && rateds == "All")
   {
   movie = await movieModel.find({genre:req.body.genre});
    }else if(genres =="All" && countrys != "All" && rateds == "All")
   {
   movie = await movieModel.find({country:req.body.country});
    }else if(genres =="All" && countrys == "All" && rateds != "All")
   {
   movie = await movieModel.find({rated:req.body.rated});
    }else if(genres !="All" && countrys != "All" && rateds == "All")
   {
   movie = await movieModel.find({genre:req.body.genre,country:req.body.country});
    }else if(genres !="All" && countrys == "All" && rateds != "All")
   {
   movie = await movieModel.find({genre:req.body.genre,rated:req.body.rated});
    }else if(genres =="All" && countrys != "All" && rateds != "All")
   {
   movie = await movieModel.find({country:req.body.country, rated:req.body.rated});
    }else    
    movie = await movieModel.find({}); 
    if(!movie)
    {
        req.redirect('/catalogGrid');
    }
var genre= await genreModel.find({});
 var country = await countryModel.find({});
 var rated =  await ratedModel.find({});
  res.render('partials/catalogList.hbs',{
      query:name,
      movieBanner:movie.map(movie => movie.toJSON()),
      genres: genre.map(genre => genre.toJSON()),
       countrys: country.map(country => country.toJSON()),
      rateds: rated.map(rated => rated.toJSON()),
 });
});
app.get('/Error',(req,res)=>{
     const name = req.session.fullName;   
     res.render('partials/404.hbs',{query:name});
});
app.use(express.static('views'));
module.exports = app;