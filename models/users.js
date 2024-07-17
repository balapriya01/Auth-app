const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/AuthData");

const userSchema = mongoose.Schema({
    name:{
        type:String,
    },

    email:{
        type:String,
    },

    password:{
        type: String,
    }
})

module.exports = mongoose.model('users', userSchema);