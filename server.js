//express for web framework & handlebars for templating
var express = require('express');
var app = express();
var exphbs = require('express-handlebars');

//Sequelize to connect database
var Sequelize = require('sequelize');
var connection = new Sequelize('class_app_db', 'root');

var bodyParser = require('body-parser');

var session = require("express-session");

var PORT = process.env.PORT || 8080;

app.get('/', function(req, res) {
  res.render("register");
});
app.get('/login', function(req, res) {
  res.render("home");
});

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true
  }));

//create student in db
var student = connection.define('student', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    len: {
      args: [1, 15],
      msg: 'Please enter your first name',
          }
    }
  },

  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: {
        args: [1, 20],
        msg: 'Please enter your last name',
      }
    }
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      notEmpy: true,
      isEmail: true,
      msg: 'Please enter your email address',  
      }
    },
    password: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 20],
          msg: 'Please enter your password',
        }
      }
    },

});

app.use(session({
  secret: "my super secret",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 *30
  },
  saveUninitialized: true,
  resave: false
}));
app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req,res){
  res.render("login");
});

app.get("/login", function(req, res){
  res.render("login");
});
// //query the db to see if user is student or instructor and render correct page
app.post("/login", function(req,res){
  res.render("students");
});
app.listen(PORT, function() {
  console.log("Listening on port %s", PORT); 
});