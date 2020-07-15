"use strict";

var _expressSession = _interopRequireDefault(require("express-session"));

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

var _database = _interopRequireDefault(require("../database"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var MongoStore = (0, _connectMongo["default"])(_expressSession["default"]);
/**
 * Initialize Session
 * Uses MongoDB-based session store
 *
 */

var init = function init() {
  if (process.env.NODE_ENV === 'production') {
    return (0, _expressSession["default"])({
      secret: _config["default"].sessionSecret,
      resave: false,
      saveUninitialized: false,
      unset: 'destroy',
      store: new MongoStore({
        mongooseConnection: _database["default"].Mongoose.connection
      })
    });
  }

  return (0, _expressSession["default"])({
    secret: _config["default"].sessionSecret,
    resave: false,
    unset: 'destroy',
    saveUninitialized: true
  });
};

module.exports = init();