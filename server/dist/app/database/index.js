"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _config = _interopRequireDefault(require("../config"));

var _user = _interopRequireDefault(require("./schemas/user"));

var _room = _interopRequireDefault(require("./schemas/room"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Connect to the database
// construct the database URI and encode username and password.
var dbURI = "mongodb://".concat( // encodeURIComponent(config.db.username) + ":" +
// encodeURIComponent(config.db.password) + "@" +
_config["default"].db.host, ":").concat(_config["default"].db.port, "/").concat(_config["default"].db.name);

_mongoose["default"].connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); // Throw an error if the connection fails


_mongoose["default"].connection.on('error', function (err) {
  // if(err) throw err;
  if (err) console.error(err);
}); // mpromise (mongoose's default promise library) is deprecated,
// Plug-in your own promise library instead.
// Use native promises


_mongoose["default"].Promise = global.Promise;
var _default = {
  Mongoose: _mongoose["default"],
  models: {
    user: _user["default"],
    room: _room["default"]
  }
};
exports["default"] = _default;