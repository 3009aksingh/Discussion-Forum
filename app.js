const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  console.log("3");

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//body parser

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//   connect flash

app.use(flash());

//global variables

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(express.urlencoded({ extended: false }));

// Routes -> connecting with users.js 
app.use('/users', require('./routes/users.js'));
// Routes -> connecting with index.js 
app.use('/', require('./routes/index.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on  ${PORT}`);
})

//first welcom.ejs is executed via index.js because in package.json , main : index.js
//login and register page is handled by users.js