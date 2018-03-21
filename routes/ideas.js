const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

//Destructuring to bring in helper
const {enureAuthenticated} = require('../helpers/auth');

//Load Idea Model (Idea.js)
require("../models/Idea");
const Idea = mongoose.model("ideas");

//Idea Index Page
router.get("/", enureAuthenticated, (req, res) => {
  Idea.find({user:req.user.id})
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

//Add Idea Form
router.get('/add', enureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

//Edit Idea Form
router.get("/edit/:id", enureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    //To prevent editing another users ideas
    if(idea.user !=req.user.id){
      req.flash('error_msg', 'Not Authorised');
      res.redirect('/ideas');
    } else{
      res.render("ideas/edit", {
        idea: idea
      });
    }
  });
});

//Process Form
router.post("/", enureAuthenticated, (req, res) => {
  //validation
  let errorsArray = [];
  //verify if title contains value
  if (!req.body.title) {
    //push error message into array
    errorsArray.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    //push error message into array
    errorsArray.push({ text: "Please add some details" });
  }

  if (errorsArray.length > 0) {
    res.render("ideas/add", {
      errors: errorsArray,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      points: req.body.points,
      user: req.user.id
    };
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Application Idea Added');
        res.redirect("/ideas");
    });
  }
});

//Edit Form Process
router.put("/:id", enureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    //new values
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.points = req.body.points;
        
    //save to database
    idea.save().then(idea => {
      req.flash('success_msg', 'Application Idea Updated');
      res.redirect("/ideas");
    });
  });
});

//Delete Idea
router.delete("/:id", enureAuthenticated, (req, res) => {
  Idea.remove({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'Application Idea Deleted');
    res.redirect("/ideas");
  });
});

//Export Router
module.exports = router;