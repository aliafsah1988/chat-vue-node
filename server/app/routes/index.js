'use strict';
const httpStatus = require('http-status-codes')
var express	 	= require('express');
var router 		= express.Router();

var User = require('../models/user');
var Room = require('../models/room');

const auth = require('../auth')

// Home page
router.get('/', function(req, res, next) {
	// If user is already logged in, then redirect to rooms page
	if(req.isAuthenticated()){
		res.redirect('/rooms');
	}
	else{
		res.render('login', {
			success: req.flash('success')[0],
			errors: req.flash('error'), 
			showRegisterForm: req.flash('showRegisterForm')[0]
		});
	}
});

// Login
router.post('/login', function(req, res, next) {
    let username = req.body.username;
	let password = req.body.password;
	auth.login(username, password, (error, user)=>{
		if(error) res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
		else res.status(httpStatus.OK).send(user);
	});
  });

// Register via username and password
router.post('/register', function(req, res, next) {

	var credentials = {'username': req.body.username, 'password': req.body.password };

	if(credentials.username === '' || credentials.password === ''){
		res.status(httpStatus.BAD_REQUEST).send('Missing credentials');
	}else{
		auth.register(credentials, (error, data) => {
			if(error) res.status(httpStatus.NOT_ACCEPTABLE).send(error);
			else res.status(httpStatus.OK).send(data);
		})
	}
});

// Rooms
// router.get('/rooms', [User.isAuthenticated, function(req, res, next) {
// 	Room.find(function(err, rooms){
// 		if(err) throw err;
// 		res.status(httpStatus.OK).send({'rooms': rooms });
// 	});
// }]);

router.get('/rooms', auth.checkAuthForRequest, function(req, res, next) {
    Room.find(function(error, rooms){
		if(error) res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
		else res.status(httpStatus.OK).send({'rooms': rooms });
	});
  });

// Chat Room 
router.get('/chat/:id', auth.checkAuthForRequest, function(req, res, next) {
	var roomId = req.params.id;
	Room.findById(roomId, function(err, room){
		if(err) throw err;
		if(!room){
			return next(); 
		}
		res.render('chatroom', { user: req.user, room: room });
	});
	
});

// Logout
router.get('/logout', function(req, res, next) {
	// remove the req.user property and clear the login session
	req.logout();

	// destroy session data
	req.session = null;

	// redirect to homepage
	res.redirect('/');
});

module.exports = router;