"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Each connection object represents a user connected through a unique socket.
 * Each connection object composed of {userId + socketId}. Both of them together are unique.
 *
 */
var RoomSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: true
  },
  connections: {
    type: [{
      userId: String,
      socketId: String
    }]
  }
});

var roomModel = _mongoose["default"].model('room', RoomSchema);

module.exports = roomModel;