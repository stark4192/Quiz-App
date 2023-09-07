const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
      type:String,
      required:true,
    },
})

const Userdb = mongoose.model('userLogined', schema)

module.exports = Userdb
