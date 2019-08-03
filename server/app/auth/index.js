'use strict';

var config 		= require('../config');
// var logger 		= require('../logger');

var User = require('../models/user');
var httpStatus = require("http-status-codes");
var jwt  = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

module.exports = {
	getUserByToken : (token) => {
		console.log(`getUserByToken`)
		return new Promise((resolve, reject) => {
			console.log(`token: ${token}`)
			jwt.verify(token, config.secret, function(err, decoded) {
				if (err) { reject(); }
				console.log(`verify Token: ${JSON.stringify(decoded)}`)
				User.findOne({ _id : decoded.id }, function(err, user) {
					if (err) { reject(); }
					else if (!user) {
						reject();
					}
					console.log(`resolving user by token`)
					resolve(user);
				});
			});
		});
	},
	checkAuthForRequest: (req, res, next) => {
		try {
			console.log(`checkAuthForRequest`)
			var token = req.headers["x-access-token"];
			if (!token) {
				return res.status(httpStatus.UNAUTHORIZED).send();
			}
			jwt.verify(token, config.secret, function(err, decoded) {
				if (err) { return res.status(httpStatus.UNAUTHORIZED).send(err); }
				console.log(`verify Token: ${JSON.stringify(decoded)}`)
				User.findOne({ _id : decoded.id }, function(err, user) {
					if (err) { return res.status(httpStatus.UNAUTHORIZED).send(err); }
					else if (!user) {
						return res.status(httpStatus.UNAUTHORIZED).send();
					}
					next();
					});
			});
		} catch (err) {
			if (err) { return res.status(httpStatus.UNAUTHORIZED).send(); }
		}
	},
	login: (username, password, done) => {
		try {
			console.log(`auth login`)
				User.findOne({ username: new RegExp(username, 'i'), socialId: null }, function(err, user) {
				if (err) { return done(err, null); }

				if (!user) {
					return done('Incorrect username or password.', null);
				}
				// let passwordIsValid = bcrypt.compareSync(password, user.password);
				// if (!passwordIsValid){
				// 	return done('Incorrect username or password.', null);
				// }
				let token = jwt.sign(
				{
					id: user._id
				},
				config.secret
				// {
				//   // expiresIn: 86400 // expires in 24 hours
				// }
				);
				return done(null, {user: user, "x-access-token": token});
		});
		} catch (err) {
			if (err) { return done(err, null); }
		}
	},
	register:(credentials, done) => {
		console.log(`auth register`)
		let hashedPassword = bcrypt.hashSync(credentials.password, 8);
		credentials.password = hashedPassword;
		User.findOne({
			'username': new RegExp('^' + credentials.username + '$', 'i'),
			'socialId': null}, function(err, user){
			if(err) return done(err, null);
			if(user){
				return done('User already exists', null);
			}else{
				User.create(credentials, function(err, newUser){
					if(err) return done(err, null);
					else {
						let token = jwt.sign(
						{
							id: newUser._id
						},
						config.secret
						// {
						//   // expiresIn: 86400 // expires in 24 hours
						// }
						);
						return done(null, {user: newUser, "x-access-token": token});
					}
				});
			}
		});
	}
}