//express setup
var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080;

//database setup
var Sequelize = require('sequelize');
var connection = new Sequelize('class_app_db', 'root');

//requiring passport last
var passport = require('passport');
var passportLocal = require('passport-local');
//middleware init
app.use(require('express-session')({
    secret: 'mysecretishere',
    resave: true,
    saveUninitialized: true,
    cookie : { secure : false, maxAge : (1000 * 60 * 60 * 24 * 30) }, // 4 hours
}));
app.use(passport.initialize());
app.use(passport.session());

//passport use methed as callback when being authenticated
passport.use(new passportLocal.Strategy(function(username, password, done) {
    //check password in db
    User.findOne({
        where: {
            username: username
        }
    }).then(function(user) {
        //check password against hash
        if(user){
            bcrypt.compare(password, user.dataValues.password, function(err, user) {
                if (user) {
                  //if password is correct authenticate the user with cookie
                  done(null, { id: username, username: username });
                } else{
                  done(null, null);
                }
            });
        } else {
            done(null, null);
        }
    });

}));

//change the object used to authenticate to a smaller token, and protects the server from attacks
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    done(null, { id: id, username: id })
});

var bcrypt = require("bcryptjs");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

var Student = connection.define('student', {
  firstname: {
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
  lastname: {
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
      //isEmail: true,
      msg: 'Please enter your email address',  
      }
    },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [5,10],
        msg: "Your password must be between 5-10 characters"
      },
    }
  }
}, {
  hooks: {
    beforeCreate: function(input){
      input.password = bcrypt.hashSync(input.password, 10);
    }
  }
});


//handlebars setup
var expressHandlebars = require('express-handlebars');
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//check login with db
app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/?msg=Login Credentials do not work'
}));


app.get("/", function(req, res){
  res.render('register', {msg: req.query.msg});
})

app.get('/home', function(req, res){
  res.render('home', {
    user: req.user,
    isAuthenticated: req.isAuthenticated()
  });
})
app.post("/register", function(req, res){
  Student.create(req.body).then(function(result){
    res.redirect('/?msg=Account created');
  }).catch(function(err) {
    console.log(err);
    res.redirect('/?msg=' + err.errors[0].message);
  });
})

// database connection via sequelize
connection.sync().then(function() {
  app.listen(PORT, function() {
      console.log("Listening on:" + PORT)
  });
});