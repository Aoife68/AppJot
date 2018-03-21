const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  Date:{
    type: Date,
    default: Date.now
  }
});

//Connect mongoose to user schema
mongoose.model('users', UserSchema);