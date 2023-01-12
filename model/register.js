const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required: true,
        trim: true
    },
    name:{
        type:String,
        required:true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});


//create a model for the user
const user = mongoose.model('User', userSchema);
//export the model
module.exports = user;