const mongoose = require('mongoose');

//schema for register and login system

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//defining and creating the collection named User in database.

const User = mongoose.model('User', UserSchema);

//for exporting data content of settingQuestion.js to app.js
module.exports = User;