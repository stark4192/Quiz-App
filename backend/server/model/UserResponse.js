// models/UserResponse.js

const mongoose = require('mongoose');

var userResponseSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    testId: { type: String, required: true },
    answers: [{
      questionId: { type: String, required: true },
      selectedChoices: [{ type: String, required: true }] 
    }]
});

const Responsesdb= mongoose.model('userresponses', userResponseSchema);
module.exports = Responsesdb;
