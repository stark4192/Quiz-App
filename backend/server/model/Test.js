// models/Test.js

const mongoose = require('mongoose');

var testSchema = new mongoose.Schema({
    testId: String,
    testName: String,
    questions: [{
    questionId: String,
    questionText: String,
    choices: [{
        choiceId: String,
        choiceText: String,
        isCorrect: Boolean,
        }],
    }],
});
const Testdb= mongoose.model('testdbs', testSchema);
module.exports  = Testdb
