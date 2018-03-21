const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Create Schema
const IdeaSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  details:{
    type: String,
    required: true
  },
  points:{
    type: String,
    required: true
  },
  user:{
    type: String,
    required: true
  },
  Date:{
    type: Date,
    default: Date.now
  }
});

//Connect mongoose to idea schema
mongoose.model('ideas', IdeaSchema);