//index.js is mentioned in package.json as main : index.js , So execution of program starts with 
// index.js where overall execution is maintained under app.js

const express = require('express');// common
const router = express.Router(); //common

const {ensureAuthenticated} = require('../config/auth')

//welcome page -> for rendering welcome.ejs file
router.get('/', (req, res) => res.render('welcome')); //firstly welcome.ejs is executed.

//dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', {
    name : req.user.name
})); //protecting from directly going to dashboard without login


//for connecting with app.js
module.exports = router; //common