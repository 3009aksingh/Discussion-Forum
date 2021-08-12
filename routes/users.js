const express = require('express');

const mongoose = require('mongoose');
const router = express.Router();
var assert = require("assert");
const bcrypt = require('bcryptjs');
//user model
var mongo = require("mongodb").MongoClient;
const User = require('../models/User')
const passport = require('passport');
const sendResponse = require('../models/sendResponse');
var ObjectID = require('mongodb').ObjectID;
//load user model
const settingQuestion = require('../models/settingQuestion');
var url = process.env.DB_MONGODDB_URI;
const dotenv = require('dotenv');
dotenv.config();
//! cookie settings

const helmet = require("helmet");
const cookieparser = require("cookie-parser");
router.use(helmet());
router.use(cookieparser());
router.use(express.json());
router.use(express.urlencoded({
  extended: false
}));
//!cookie ends

const settinquestionsSchema = {
  name: String, //moviesSchema = settinquestionsSchema
  subject: String,
  question: String,
  _id: Object
}

const sendresponsesSchema = {
  name: String, //moviesSchema = settinquestionsSchema
  subject: String,
  question: String,
  response: String,
  _id: Object
}

const sendresponse = mongoose.model('sendresponse', sendresponsesSchema);

router.get('/discussion4th', (req, res) => {
  sendresponse.find({}, function (err, sendresponses) {
    res.render('discussion4th', {
      sendresponsesList: sendresponses
    })
  })
})

const settinquestion = mongoose.model('settinquestion', settinquestionsSchema);

router.get('/discussion2nd', (req, res) => {
  settinquestion.find({}, function (err, settinquestions) {
    res.render('discussion2nd', {
      settinquestionsList: settinquestions
    })
  })
})

const compression = require('compression')
router.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
      if (req.header['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res)
    }
  })
)

router.get('/delete', (req, res) => res.render('delete'));

//LOGIN PAGE -> for rendering login.ejs
// ?router.get('/login', (req, res) => res.render('login'));
router.get("/login", (req, res) => {
  // check if there is a msg query
  let bad_auth = req.query.msg ? true : false;

  // if there exists, send the error.
  if (bad_auth) {
    return res.render("login", {
      error: "Invalid email or password",
    });
  } else {
    // else just render the login
    return res.render("login");
  }
});

//Register page -> for rendering register.ejs
router.get('/register', (req, res) => res.render('register'));

router.get('/Admin2ndDiscuss', (req, res) => {
  settinquestion.find({}, function (err, settinquestions) {
    res.render('Admin2ndDiscuss', {
      settinquestionsList: settinquestions
    })
  })
})

router.get('/Admin4thDiscuss', (req, res) => res.render('Admin4thDiscuss'));

//calling discussion forum 1st page 
// ? router.get('/discussion1st', (req, res) => res.render('discussion1st'));
router.get("/discussion1st", (req, res) => {
  // get the email
  let email = req.cookies.email;

  // render discussion1st page
  return res.render("discussion1st", {
    email,
  });
});


router.get('/discussion3rd', (req, res) => res.render('discussion3rd'));
//post request for 1st page of discussion forum used for question intake.

// router.get('/deleteQuestions', (req, res) => res.render('delete'));
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


router.post("/deleteQuestions", (req, res, next) => {

  console.log("Log user 17");
  const question = req.body.question;
  console.log(question);
  // const questionaire = JSON.stringify(question);

  // const csrfToken = "";
  mongo.connect(
    url, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    },
    function (error, client) {
      console.log("Log user 18");
      assert.strictEqual(null, error);
      console.log("Log user 19");
      const db = client.db("DiscussionForum");

      db.collection("settinquestions").findOneAndDelete({
          _id: ObjectID(question)
        },
        function (error, result) {


          console.log("Log user 20");
          assert.strictEqual(null, error);
          console.log("Item deleted");
          // res.redirect("/poll/vote");
          console.log("Log user 21");
          client.close();
        }
      );
    }
  );
  console.log("Log user 15");
  res.redirect("/users/delete");
});



router.post("/deleteResponses", (req, res, next) => {

  console.log("Log user 17");
  const response = req.body.response;
  console.log(response);
  // const questionaire = JSON.stringify(question);

  // const csrfToken = "";
  mongo.connect(
    url, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    },
    function (error, client) {
      console.log("Log user 18");
      assert.strictEqual(null, error);
      console.log("Log user 19");
      const db = client.db("DiscussionForum");

      db.collection("sendresponses").findOneAndDelete({
          _id: ObjectID(response)
        },
        function (error, result) {


          console.log("Log user 20");
          assert.strictEqual(null, error);
          console.log("Item deleted");
          // res.redirect("/poll/vote");
          console.log("Log user 21");
          client.close();
        }
      );
    }
  );
  console.log("Log user 15");
  res.redirect("/users/delete");
});















//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


router.post("/discussion1st", async (req, res) => { //   changed /index to whatever
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


router.post("/discussion3rd", async (req, res) => { //for response POST request

  try {
    const sendResponseData = new sendResponse(req.body);
    await sendResponseData.save();
    res.redirect("/users/discussion4th");
  } catch (error) {
    res.status(500).send(error);
  }
})

//Register Handle
router.post('/register', (req, res) => {
  const {
    name,
    email,
    password,
    password2
  } = req.body;
  let errors = [];

  //check the required fields
  if (!name || !email || !password || !password2) {
    errors.push({
      msg: 'Please enter all fields'
    });
  }

  //check password
  if (password != password2) {
    errors.push({
      msg: 'Passwords do not match'
    });
  }

  //check password length

  if (password.length < 6) {
    errors.push({
      msg: 'Password must be at least 6 characters'
    });
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
    User.findOne({
      email: email
    }).then(user => {
      if (user) {
        errors.push({
          msg: 'Email already exists'
        });
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

        bcrypt.genSalt(10, (err, salt) => { //for encrypting the users typed
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
                res.redirect('/users/login'); //because of this after registering we get login page as we are redirected to it.
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

  let {
    email,
    password
  } = req.body;
  // saving the data to the cookies
  res.cookie("email", email);
  // redirect

  passport.authenticate('local', {
    successRedirect: '/discussion1st', //linking with our project Man! i.e. discussion forum
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
  // redirect with a fail msg
  //***************** */ return res.redirect("/login?msg=fail");

});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie("email");
  // redirect to login

  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;