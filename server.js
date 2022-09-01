//___________________
//Dependencies
//___________________
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session')
const Blog = require('./models/blog.js')
const userController = require('./controllers/users_controller.js')
const sessionsController = require('./controllers/sessions_controller.js')
require('dotenv').config()

const app = express();

app.use(express.json())
app.use(cors())

//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;


//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);


app.use(
    session({
        secret: 'secretidhere', //a random string do not copy this value or your stuff will get hacked
        resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
        saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
    })
)

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

app.use('/users', userController)

app.use('/sessions', sessionsController)

//-----------------------------------------------
//      GET SINGLE Blog
//-----------------------------------------------
app.get('https://pacific-savannah-73208.herokuapp.com/:id', (req, res) => {
    Blog.find({}, (err,foundBlog) => {
      res.json(foundBlog)
    })
  })
  
  //-----------------------------------------------
  //      NEW Blog
  //-----------------------------------------------
  app.post('https://pacific-savannah-73208.herokuapp.com', (req, res) => {
    Blog.create(req.body, (err, createdBlog)=>{
      res.json(createdBlog)
    })
  })
  
  //-----------------------------------------------
  //      GET ALL BlogS
  //-----------------------------------------------
  app.get('https://pacific-savannah-73208.herokuapp.com', (req, res) => {
    Blog.find({}, (err,foundBlogs) => {
      res.json(foundBlogs)
    })
  })
  
  //-----------------------------------------------
  //      DELETE Blog
  //-----------------------------------------------
  app.delete('https://pacific-savannah-73208.herokuapp.com/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => {
      res.json(deletedBlog)
    })
  })
  
  //-----------------------------------------------
  //      EDIT Blog
  //-----------------------------------------------
  app.put('https://pacific-savannah-73208.herokuapp.com/:id', (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedBlog) => {
      res.json(updatedBlog)
    })
  })

  //___________________
//Listener
//___________________
app.listen(process.env.PORT, () => console.log(process.env.PORT));