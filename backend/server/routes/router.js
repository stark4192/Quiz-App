const express=require('express');
const route=express.Router();
const controller =require('../controller/controller');

route.get('/',controller.api)
route.get('/welcome',controller.welcome);
route.post('/signup',controller.signup)
route.post('/signin',controller.signin)
// route.put('/edit/phonenumber',controller.updatePhoneNumber)
// route.post('/submit-test',controller.submit);

module.exports = route