const mongoose = require("mongoose");
// const validator = require("validator");


//schema for sendResponse collection present in database
const sendResponseSchema = mongoose.Schema({

    name: {
        type: String,
        require: true,
        minLength: 3
    },

    subject: {
        type: String,
        require: true,
        minLength: 3
    },

    question: {
        type: String,
        require: true,
        minLength: 3
    },

    response: {
        type: String,
        require: true,
        minLength: 3
    },
    // _id: [{
    //     type: Object,
    //     require: false
    // }]

})

//defining and creating collection named sendResponse in database

const sendResponse = mongoose.model("sendResponse", sendResponseSchema);

//exporting the content of sendResponse.js to app.js as app.js is the moderator of the flow of this program
//so this file must be connected with app.js in order to get this file executed.
module.exports = sendResponse;