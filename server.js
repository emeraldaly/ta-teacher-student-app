var express = require('express');
var expressHandlebars = require('express-Handlebars');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');

var connection = new Sequelize('class_app_db', 'root', {

});

var PORT = 8080

var app = express();

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

console.log("Listening on port %s", PORT); 