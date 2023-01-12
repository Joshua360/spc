const express = require('express');
const app = express();
const User = require('./model/register');
const Login = require('./model/login');
const Blog = require('./model/blog');
const session = require('express-session');

app.use(session( {
  secret: 'komoga',
  resave: true,
  saveUninitialized: false
}));


//body parser middleware
const bodyParser = require('body-parser');
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//set view engine to pug
app.set('view engine', 'pug');
//set public folder
// app.use(express.static(__dirname + '/public'));
app.use('/static', express.static('public'));
//mongoose
const mongoose = require('mongoose');
//env variables
require('dotenv').config();
const mongoDB = process.env.DATABASE
const dbUser = process.env.USERNAME
const dbPassword = process.env.PASSWORD  

//connect to db using mongoose
const uri = `mongodb+srv://Admin:${dbPassword}@cluster0.fsblo.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));
  

// mongoose.connect('mongodb://localhost:27017/nodekb', { useNewUrlParser: true })
//   .then(() => console.log('MongoDB Connected...'))
//   .catch(err => console.log(err));

// let db = mongoose.connection;













const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  //check if user is logged in
  if (req.session.userId === undefined) {
      const word = 'Login';
      res.render('login', {word: word});
  } else {
      res.redirect('/create');
  }

});

app.post("/login", (req,res)=>{
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email, password: password})
  .exec(function (error, user) {
      if (error) {
          console.log("Error finding user");
          // return next(error);
      } else {
          if (user === null) {
              console.log("User not found");
              res.redirect('/');
          } else {
              req.session.userId = user._id;
              res.redirect('/create');
          }
      }
  });




  
});

app.get('/create', (req, res, next) => {
  //only allow logged in users to create posts
  if (req.session.userId === undefined) {
      let err = new Error("You must be logged in to view this page.");
      err.status = 401;
      return next(err);
  }

  res.render('create');
})





app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  //check atleast one user is registered
  User.countDocuments({}, (err, count) => {
    if (count > 0) {
      console.log('Sorry only one user can be registered');
      return res.redirect('/');
    }
  });

  let user = new User();
  user.email = req.body.email;
  user.name = req.body.name;
  user.password = req.body.password;

  user.save((err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log('User registered');
      res.redirect('/');
    }
  });
});

app.get("/api/posts", (req,res, next)=>{
  //if user is not logged in, redirect to login page
  if (req.session.userId === undefined) {
      return res.redirect('/');
  }


  Blog.find({}, (err, blogs)=>{
    if (err) {
      console.log(err);
    } else {
      console.log(blogs);
      res.render('posts', {
        blogs: blogs
      });
    }
  });

});


app.get("/api/posts/:id", (req,res)=>{
 

  Blog.findById(req.params.id, (err, blog)=>{
    if (err) {
      console.log(err);
    } else {
      console.log(blog);
      res.render('post', {
        blog: blog
      });
    }
  });

});

//update
app.get("/api/posts/:id/edit", (req,res)=>{
  Blog.findById(req.params.id, (err, blog)=>{
    if (err) {
      console.log(err);
    } else {
      console.log(blog);
      res.render('edit', {
        blog: blog
      });
    }
  });

});
//update post
app.post("/api/posts/:id", (req,res)=>{
  let blog = {};
  blog.title = req.body.title;
  blog.body = req.body.body;

  let query = {_id:req.params.id}

  Blog.update(query, blog, (err)=>{
    if (err) {
      console.log(err);
      return;
    } else {
      console.log('Blog updated');
      res.redirect('/api/posts');
    }
  })

});




app.post("/create", (req,res, next)=>{
  // only allow logged in users to create posts
  if (req.session.userId === undefined) {
      let err = new Error("You must be logged in to view this page.");
      err.status = 401;
      return next(err);
  }


  let blog = new Blog();
  blog.title = req.body.title;
  blog.body = req.body.body;
  blog.save((err)=>{
    if (err) {
      console.log(err);
      return;
    } else {
      console.log('Blog created');
      res.redirect('/api/posts');
    }
  })

});

// api endpoint for all posts
app.get('/api/all/posts', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      console.log(blogs);
      res.json(blogs);
    }
  });
});






















// GET /logout -- destroy the session
app.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});




app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


