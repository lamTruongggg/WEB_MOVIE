const express =  require('express');
const genreModel = require('../models/genre');
const countryModel = require('../models/country')
const path = require('path');
const ratedModel = require('../models/rated');
const movieModel =  require('../models/movie');
const showingModel = require('../models/showing')
const cinemaModel = require('../models/cinema');
const app = express();


const isAuth = (req,res, next)=>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect('/Users');
    }
}
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
app.get('/detailMovie/:id',async(req,res)=>{
     const name = req.session.email;   
      var movie = await movieModel.findOne({fullName:req.params.id});
       var movieBanner = await movieModel.find({}).sort({_id:-1}).limit(6);
       var showing = await showingModel.findOne({fullName:req.params.id});
       try{
       if(showing)
       {
     res.render('partials/detailMovie.hbs',{
         query:name,
         movies: movie.toJSON(),
          movieBanner:movieBanner.map(movie => movie.toJSON()),
          showing: showing.toJSON()
    });}
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