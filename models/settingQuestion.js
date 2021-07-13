const mongoose = require("mongoose");
// const validator = require("validator");

//schema for settingQuestion ( present on 1st page of discussion forum )
const settingQuestionSchema = mongoose.Schema({
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

    // _id: [{
    //     type: Object,
    //     require: false
    // }]

})

//defining and creating the collection named settingQuestion in database.

const settingQuestion = mongoose.model("settinQuestion", settingQuestionSchema);
//for exporting settingQuestion.js to app.js
module.exports = settingQuestion;