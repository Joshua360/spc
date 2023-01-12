const mongoose = require('mongoose');

// define blog schema
const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

//create blog model
const blog = mongoose.model('Blog', blogSchema);
// export blog model
module.exports = blog;