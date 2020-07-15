"use strict";

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var logger = new _winston["default"].Logger({
  transports: [new _winston["default"].transports.File({
    level: 'debug',
    json: true,
    filename: './debug.log',
    handleExceptions: true
  }), new _winston["default"].transports.Console({
    level: 'debug',
    json: true,
    handleExceptions: true
  })],
  exitOnError: false
});
module.exports = logger;