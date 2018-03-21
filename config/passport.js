const LocalStrategy = require('passport-local').Strategy;

//const UserModel = require('../models/user');
//const config = require('../config/database');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

//Load User Model (User.js)
//require("../models/User");
const User = mongoose.model('users');


//export module with function that defines user field
module.exports = function(passport){
  //defining usernameField not required if using user name to login 
  passport.use(new LocalStrategy({usernameField:'email'}, (email, password, done) => {
    //check if user exists in db then check password
    User.findOne({
      email: email
    }).then(user =>{
      if(!user){
        //The false refers to the fact that there is no user
        return done(null, false, {message:'No User Found'});
      }

      //Match password
      bcrypt.compare(password, user.password, (err, isMatch)=>{
        if(err) throw err;

        if(isMatch){
          return done(null, user);
        } else{
          return done(null, false, {message:'Password Incorrect'});
        }
      })

    })
  }));

  //serialization and deserialization of session
  passport.serializeUser((user, done)=> {
    done(null, user.id);
  });

  passport.deserializeUser((id, done)=> {
    User.findById(id, (err, user)=> {
      done(err, user);
    });
  });
}