const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const mongoose = require("mongoose");

//Load User Model (User.js)
require("../models/User");
const User = mongoose.model("users");

//User Login Route
router.get("/login", (req, res) => {
  res.render("users/login");
});

//User Register Route
router.get("/register", (req, res) => {
  res.render("users/register");
});

//Login Form POST
router.post("/login", (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/ideas',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

//Register Form POST
router.post("/register", (req, res) => {
  let errorsArray = [];

  //check passwords match
  if (req.body.password != req.body.password2) {
    errorsArray.push({
      text: "Passwords do not match"
    });
  }
  //check password length greater than 4 chars
  if (req.body.password < 4) {
    errorsArray.push({ text: "Passwords must be at least four characters" });
  }

  //check if there are errors in the array
  if (errorsArray.length > 0) {
    res.render("users/register", {
      errors: errorsArray,
      //passing the below details is used so that
      //user does not have to re-enter details if
      //the input the incorrect details
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    //Validation to ensure login name(email) unique
    User.findOne({email: req.body.email })
    .then(user => {
      if (user) {
        req.flash("error_msg", "Email already registered");
        res.redirect("/users/register");
      } else {
        //Create new user - diff to how created in idea.js
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //hash the password
            newUser.password = hash;
            //save user with hashed password in db
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        }); //End bcrypt.genSalt
      }
    });
  } //end else errorArray
}); //End POST method

//Logout User
router.get('/logout', (req,res) =>{
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
