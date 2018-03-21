const express = require("express");
const path = require('path');
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require('passport');

//Initialise Application
const app = express();

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);
//DataBase config
const db = require('./config/database');

//Connect to database
mongoose
  .connect(db.mongoURI)
  .then(() => console.log("Mongo DB Connected..."))
  .catch(err => console.log(err));


/********Middleware**********/

//Handlebars middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static Folder middleware
app.use(express.static(path.join(__dirname, 'public')));

//Method Override middleware
app.use(methodOverride("_method"));

//Express Session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true    
  })
);

//Passport Middleware - must be after express session middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash middleware
app.use(flash());


//Global Variables
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
//hiding fields
res.locals.user = req.user || null;

  next();
});

/*****Routes******/
//Index Route
app.get("/", (req, res) => {
  const title = "Application Jotter";
  res.render("index", {
    title: title
  });
});

//About Route
app.get("/about", (req, res) => {
  res.render("about");
});


//Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

//Set port
const port = process.env.PORT || 3000;

//Set up server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
