const express =  require('express');
const userModel = require('../models/user');
const genreModel = require('../models/genre');
const countryModel = require('../models/country');
const ratedModel = require('../models/rated');
const personModel = require('../models/person');

const path = require('path');
const bcrypt = require('bcryptjs');
const app = express();

const isAuth = (req,res, next)=>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect('/Users');
    }
}

app.get('/register',(req,res)=>{
     const email = req.session.email;   
     res.render('partials/register.hbs',{query:email});
});
app.get('/myProfile',isAuth,async(req,res)=>{
     const email = req.session.email;  
     const user = await userModel.findOne({email:email});
     res.render('partials/profile.hbs',{query:email,user:user.toJSON()});
});
app.post('/add', async(req,res)=>{
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
app.get('/listUser', isAuth,(req,res)=>{
    const email = req.session.email;   
    userModel.find({}).then(users =>{
    res.render('partials/listUser.hbs',{
        users: users.map(user => user.toJSON())
    });
    })
});
function addRecord(req,res)
{
    const body = req.body;
    const users =  new userModel(body);
    var datetime = new Date();
    users.dateCreate= datetime;
    try{
        userModel.findOne({email:users.email}).then(user=>{
        if(user){
            res.render('partials/register.hbs',{
        viewTitle:"Email Already"});
        }
        else{        
            const hashedPws = bcrypt.hashSync(users.password,12);
           users.password= hashedPws;
            users.save();
    //res.send(u);
            res.render('partials/register.hbs',{
        viewTitle:"Insert User successfull"});
        }
    })
    }catch(error)
    {
        res.status(500).send(error);
    }
}
function updateRecord(req,res)
{
    
     userModel.findOneAndUpdate({_id:req.body.id},req.body,{new:true},(err,user)=>{
        if(!err){
                res.redirect('/Users/list');
            }
            else
            {
                console.log(err);
            }
        });
}
app.get('/edit/:id', (req,res)=>{
    userModel.findById(req.params.id,(err,user)=>{
        if(!err){
            res.render('users/addOrEdit.hbs',{
                user:user.toJSON()
            });
        }
    });
});
app.get('/delete/:id', async(req,res)=>{
    try{
        const user = await userModel.findByIdAndDelete(req.params.id,req.body);
        if(!user) res.status(404).send("No item found");
        else
        res.redirect('/Users/listUser');
        //res.status(200).send();
    }
    catch(error)
    {
        res.status(500).send(error);
    }
});

app.get('/', async(req,res)=>{      
     res.render('partials/login.hbs');
});
app.get('/addMovieForm', async(req,res)=>{   
    var genre= await genreModel.find({});
    var country = await countryModel.find({});
    var rated =  await ratedModel.find({});
    var person = await personModel.find({});
     res.render('partials/movieForm.hbs',{
         viewTitles: "Insert New Movies",
         genre: genre.map(genre => genre.toJSON()),
         country: country.map(country => country.toJSON()),
         rated: rated.map(rated => rated.toJSON()),
         person: person.map(person => person.toJSON())
     });
});
app.post('/login', async(req,res)=>{
       const body = req.body;
    const users =  new userModel(body);
    userModel.findOne({email:users.email}).then(user=>{
        if(!user){            
        return res.render('/Users',{view: "validate Email or Pasword"});
    }
    const pass = user.password;
    const validPassword =  bcrypt.compareSync(body.password,pass);
      if (!validPassword) {
        return res.render('/Users',{view: "validate Email or Pasword"});
      }
      req.session.isAuth =true;
      req.session.email = user.email;
      req.session.fullName = user.fullName;
      res.redirect('/');
      });  
});
app.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/Users');
    });
});
app.use(express.static('views'));

module.exports = app;