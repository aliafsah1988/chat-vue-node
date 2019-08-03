'use strict';

// Chat application dependencies
var express 	= require('express');
var app  		= express();
var path 		= require('path');
var bodyParser 	= require('body-parser');
var flash 		= require('connect-flash');

// Chat application components
var routes 		= require('./app/routes');
var session 	= require('./app/session');
// var passport    = require('./app/auth');
var ioServer 	= require('./app/socket')(app);
var logger 		= require('./app/logger');

// Set the port number
var port = process.env.PORT || 3000;

// // View engine setup
// app.set('views', path.join(__dirname, 'app/views'));
// app.set('view engine', 'ejs');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session);
// app.use(passport.initialize());
// app.use(passport.session());
app.use(flash());

// Add headers
app.use(function(req, res, next) {
  // Website you wish to allow to connect
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

      // Request methods you wish to allow
      res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, OPTIONS, PUT, PATCH, DELETE"
      );

      // Request headers you wish to allow
      res.setHeader(
          "Access-Control-Allow-Headers",
          "X-Requested-With,content-type,x-access-token,encType"
      );

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader("Access-Control-Allow-Credentials", true);

      // Pass to next layer of middleware
      next();
  });



app.use('/', routes);

// Middleware to catch 404 errors
app.use(function(req, res, next) {
  res.status(404).sendFile(process.cwd() + '/app/views/404.htm');
});

ioServer.listen(port);