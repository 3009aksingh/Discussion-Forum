//index.js is mentioned in package.json as main : index.js , So execution of program starts with 
// index.js where overall execution is maintained under app.js

const express = require('express'); // common
const router = express.Router(); //common

const {
    ensureAuthenticated
} = require('../config/auth')
const compression = require('compression')
//welcome page -> for rendering welcome.ejs file
// ??router.get('/', (req, res) => res.render('welcome')); //firstly welcome.ejs is executed.
const helmet = require("helmet");
const cookieparser = require("cookie-parser");
router.use(helmet());
router.use(cookieparser());
router.use(express.json());
router.use(express.urlencoded({
    extended: false
}));

router.use(
    compression({
        level: 6,
        threshold: 100 * 1000,
        filter: (req, res) => {
            if (req.header['x-no-compression']) {
                return false
            }
            return compression.filter(req, res)
        }
    })
)

router.get("/", (req, res) => {
    // check if user is logged in, by checking cookie
    let email = req.cookies.email;
    return res.render("welcome", {
        email,
    });
});

router.get("/discussion1st", ensureAuthenticated, (req, res) => {
    // get the email
    let email = req.cookies.email;

    // render discussion1st page
    return res.render("discussion1st", {
        email,
    });
});

// //dashboard
// ?router.get('/discussion1st', ensureAuthenticated, (req, res) => res.render('discussion1st', {
//  ?   name: req.user.name
//? })); //protecting from directly going to dashboard without login


//for connecting with app.js
module.exports = router; //common