"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _connectFlash = _interopRequireDefault(require("connect-flash"));

var _routes = _interopRequireDefault(require("./app/routes"));

var _session = _interopRequireDefault(require("./app/session"));

var _socket = _interopRequireDefault(require("./app/socket"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Chat application dependencies
// Chat application components
var app = (0, _express["default"])();
var ioServer = (0, _socket["default"])(app); // Set the port number

var port = process.env.PORT || 3000; // // View engine setup
// app.set('views', path.join(__dirname, 'app/views'));
// app.set('view engine', 'ejs');
// Middlewares

app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_express["default"]["static"]('public'));
app.use(_session["default"]); // app.use(passport.initialize());
// app.use(passport.session());

app.use((0, _connectFlash["default"])()); // Add headers

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080'); // Request methods you wish to allow

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Request headers you wish to allow

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token,encType'); // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)

  res.setHeader('Access-Control-Allow-Credentials', true); // Pass to next layer of middleware

  next();
});
app.use('/', _routes["default"]); // Middleware to catch 404 errors

app.use(function (req, res, next) {
  res.status(404).sendFile("".concat(process.cwd(), "/app/views/404.htm"));
});
ioServer.listen(port);