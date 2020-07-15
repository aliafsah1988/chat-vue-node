"use strict";

var _httpStatusCodes = _interopRequireDefault(require("http-status-codes"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _user = _interopRequireDefault(require("../models/user"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = {
  getUserByToken: function getUserByToken(token) {
    console.log("getUserByToken");
    return new Promise(function (resolve, reject) {
      console.log("token: ".concat(token));

      _jsonwebtoken["default"].verify(token, _config["default"].secret, function (error, decoded) {
        if (error) {
          reject();
        }

        console.log("verify Token: ".concat(JSON.stringify(decoded)));

        _user["default"].findOne({
          _id: decoded.id
        }, function (err, user) {
          if (err) {
            reject();
          } else if (!user) {
            reject();
          }

          console.log("resolving user by token");
          resolve(user);
        });
      });
    });
  },
  checkAuthForRequest: function checkAuthForRequest(req, res, next) {
    try {
      console.log("checkAuthForRequest");
      var token = req.headers['x-access-token'];

      if (!token) {
        return res.status(_httpStatusCodes["default"].UNAUTHORIZED).send();
      }

      _jsonwebtoken["default"].verify(token, _config["default"].secret, function (err, decoded) {
        if (err) {
          return res.status(_httpStatusCodes["default"].UNAUTHORIZED).send(err);
        }

        console.log("verify Token: ".concat(JSON.stringify(decoded)));

        _user["default"].findOne({
          _id: decoded.id
        }, function (error, user) {
          if (error) {
            return res.status(_httpStatusCodes["default"].UNAUTHORIZED).send(error);
          }

          if (!user) {
            return res.status(_httpStatusCodes["default"].UNAUTHORIZED).send();
          }

          next();
        });
      });
    } catch (err) {
      if (err) {
        return res.status(_httpStatusCodes["default"].UNAUTHORIZED).send();
      }
    }
  },
  login: function login(username, password, done) {
    try {
      console.log("auth login");

      _user["default"].findOne({
        username: new RegExp(username, 'i'),
        socialId: null
      }, function (err, user) {
        if (err) {
          return done(err, null);
        }

        if (!user) {
          return done('Incorrect username or password.', null);
        } // let passwordIsValid = bcrypt.compareSync(password, user.password);
        // if (!passwordIsValid){
        // return done('Incorrect username or password.', null);
        // }


        var token = _jsonwebtoken["default"].sign({
          id: user._id
        }, _config["default"].secret // {
        //   // expiresIn: 86400 // expires in 24 hours
        // }
        );

        return done(null, {
          user: user,
          'x-access-token': token
        });
      });
    } catch (err) {
      if (err) {
        return done(err, null);
      }
    }
  },
  register: function register(inputCredentials, done) {
    console.log("auth register");

    var credentials = _objectSpread({}, inputCredentials);

    var hashedPassword = _bcryptjs["default"].hashSync(credentials.password, 8);

    credentials.password = hashedPassword;

    _user["default"].findOne({
      username: new RegExp("^".concat(credentials.username, "$"), 'i'),
      socialId: null
    }, function (err, user) {
      if (err) return done(err, null);

      if (user) {
        return done('User already exists', null);
      }

      _user["default"].create(credentials, function (error, newUser) {
        if (error) return done(error, null);

        var token = _jsonwebtoken["default"].sign({
          id: newUser._id
        }, _config["default"].secret // {
        //   // expiresIn: 86400 // expires in 24 hours
        // }
        );

        return done(null, {
          user: newUser,
          'x-access-token': token
        });
      });
    });
  }
};