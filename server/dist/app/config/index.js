"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _url = _interopRequireDefault(require("url"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var init = function init() {
  if (process.env.NODE_ENV === 'production') {
    var redisURI = _url["default"].parse(process.env.REDIS_URL);

    var redisPassword = redisURI.auth.split(':')[1];
    return {
      db: {
        username: process.env.dbUsername,
        password: process.env.dbPassword,
        host: process.env.dbHost,
        port: process.env.dbPort,
        name: process.env.dbName
      },
      sessionSecret: process.env.sessionSecret,
      facebook: {
        clientID: process.env.facebookClientID,
        clientSecret: process.env.facebookClientSecret,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos']
      },
      twitter: {
        consumerKey: process.env.twitterConsumerKey,
        consumerSecret: process.env.twitterConsumerSecret,
        callbackURL: '/auth/twitter/callback',
        profileFields: ['id', 'displayName', 'photos']
      },
      redis: {
        host: redisURI.hostname,
        port: redisURI.port,
        password: redisPassword
      },
      secret: 'supersecret'
    };
  }

  return _config["default"];
};

var _default = init();

exports["default"] = _default;