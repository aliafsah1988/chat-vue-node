"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = _interopRequireDefault(require("../database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var userModel = _database["default"].models.user;

var create = function create(data, callback) {
  var newUser = new userModel(data);
  newUser.save(callback);
};

var findOne = function findOne(data, callback) {
  userModel.findOne(data, callback);
};

var findById = function findById(id, callback) {
  userModel.findById(id, callback);
};
/**
 * Find a user, and create one if doesn't exist already.
 * This method is used ONLY to find user accounts registered via Social Authentication.
 *
 */


var findOrCreate = function findOrCreate(data, callback) {
  findOne({
    socialId: data.id
  }, function (err, user) {
    if (err) {
      return callback(err);
    }

    if (user) {
      return callback(err, user);
    }

    var userData = {
      username: data.displayName,
      socialId: data.id,
      picture: data.photos[0].value || null
    }; // To avoid expired Facebook CDN URLs
    // Request user's profile picture using user id
    // @see http://stackoverflow.com/a/34593933/6649553

    if (data.provider === 'facebook' && userData.picture) {
      userData.picture = "http://graph.facebook.com/".concat(data.id, "/picture?type=large");
    }

    create(userData, function (error, newUser) {
      callback(error, newUser);
    });
  });
};
/**
 * A middleware allows user to get access to pages ONLY if the user is already logged in.
 *
 */


var isAuthenticated = function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send();
  }
};

var _default = {
  create: create,
  findOne: findOne,
  findById: findById,
  findOrCreate: findOrCreate,
  isAuthenticated: isAuthenticated
};
exports["default"] = _default;