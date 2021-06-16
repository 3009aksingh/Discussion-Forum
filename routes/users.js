const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
//user model
const User = require('../models/User')
const passport = require('passport');
const sendResponse = require('../models/sendResponse'); 
//load user model
const settingQuestion = require('../models/settingQuestion');

const settinquestionsSchema = {  
  name : String,   //moviesSchema = settinquestionsSchema
  subject : String,
  question : String
}

const sendresponsesSchema = {    
  name : String, //moviesSchema = settinquestionsSchema
  subject : String,
  question : String,
  response : String
}

const sendresponse = mongoose.model('sendresponse', sendresponsesSchema);

router.get('/discussion4th', (req, res) => {
  sendresponse.find({}, function(err, sendresponses) {
      res.render('discussion4th', {
          sendresponsesList : sendresponses
      })
  })
})

const settinquestion = mongoose.model('settinquestion', settinquestionsSchema);

router.get('/discussion2nd', (req, res) => {
  settinquestion.find({}, function(err, settinquestions) {
      res.render('discussion2nd', {
          settinquestionsList : settinquestions
      })
  })
})

//LOGIN PAGE -> for rendering login.ejs
router.get('/login', (req, res) => res.render('login'));

//Register page -> for rendering register.ejs
router.get('/register', (req, res) => res.render('register'));

//calling discussion forum 1st page 
router.get('/discussion1st', (req, res) => res.render('discussion1st'));


router.get('/discussion3rd', (req, res) => res.render('discussion3rd'));
//post request for 1st page of discussion forum used for question intake.

router.post("/discussion1st", async (req, res) => {    //   changed /index to whatever
  try {
    console.log("after try");
      const settingQuestionData = new settingQuestion(req.body);
      console.log("before await");
      await settingQuestionData.save();
      console.log("after await");
      res.redirect("/users/discussion2nd");
      console.log("before catch");
      //possibility of error 
  } catch (error) {
      res.status(500).send(error);
  }
})


router.post("/discussion3rd", async(req,res) => {   //for response POST request
   
  try{
      const sendResponseData = new sendResponse(req.body);
      await sendResponseData.save();
      res.redirect("/users/discussion4th");
  }catch(error){
      res.status(500).send(error);
  }
})

//Register Handle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check the required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  //check password
  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  //check password length

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {  //for encrypting the users typed
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');    //because of this after registering we get login page as we are redirected to it.
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard', //linking with our project Man! i.e. discussion forum
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;
