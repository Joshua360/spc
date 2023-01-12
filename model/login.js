const mongoose = require('mongoose');





// define login schema
const loginSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});




// create login model
const login = mongoose.model('Login', loginSchema);
// export login model
module.exports = login;

