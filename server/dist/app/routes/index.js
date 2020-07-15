"use strict";

var _httpStatusCodes = _interopRequireDefault(require("http-status-codes"));

var _express = _interopRequireDefault(require("express"));

var _room = _interopRequireDefault(require("../models/room"));

var _auth = _interopRequireDefault(require("../auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // Home page


router.get('/', function (req, res, next) {
  // If user is already logged in, then redirect to rooms page
  if (req.isAuthenticated()) {
    res.redirect('/rooms');
  } else {
    res.render('login', {
      success: req.flash('success')[0],
      errors: req.flash('error'),
      showRegisterForm: req.flash('showRegisterForm')[0]
    });
  }
}); // Login

router.post('/login', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  _auth["default"].login(username, password, function (error, user) {
    if (error) res.status(_httpStatusCodes["default"].INTERNAL_SERVER_ERROR).send(error);else res.status(_httpStatusCodes["default"].OK).send(user);
  });
}); // Register via username and password

router.post('/register', function (req, res, next) {
  var credentials = {
    username: req.body.username,
    password: req.body.password
  };

  if (credentials.username === '' || credentials.password === '') {
    res.status(_httpStatusCodes["default"].BAD_REQUEST).send('Missing credentials');
  } else {
    _auth["default"].register(credentials, function (error, data) {
      if (error) res.status(_httpStatusCodes["default"].NOT_ACCEPTABLE).send(error);else res.status(_httpStatusCodes["default"].OK).send(data);
    });
  }
}); // Rooms
// router.get('/rooms', [User.isAuthenticated, function(req, res, next) {
// Room.find(function(err, rooms){
// if(err) throw err;
// res.status(httpStatus.OK).send({'rooms': rooms });
// });
// }]);

router.get('/rooms', _auth["default"].checkAuthForRequest, function (req, res, next) {
  _room["default"].find(function (error, rooms) {
    if (error) res.status(_httpStatusCodes["default"].INTERNAL_SERVER_ERROR).send(error);else res.status(_httpStatusCodes["default"].OK).send({
      rooms: rooms
    });
    return null;
  });
}); // Chat Room

router.get('/chat/:id', _auth["default"].checkAuthForRequest, function (req, res, next) {
  var roomId = req.params.id;

  _room["default"].findById(roomId, function (err, room) {
    if (err) throw err;

    if (!room) {
      return next();
    }

    res.render('chatroom', {
      user: req.user,
      room: room
    });
  });
}); // Logout

router.get('/logout', function (req, res, next) {
  // remove the req.user property and clear the login session
  req.logout(); // destroy session data

  req.session = null; // redirect to homepage

  res.redirect('/');
});
module.exports = router;