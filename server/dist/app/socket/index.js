"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redis = _interopRequireDefault(require("redis"));

var _socket = _interopRequireDefault(require("socket.io-redis"));

var _http = _interopRequireDefault(require("http"));

var _socket2 = _interopRequireDefault(require("socket.io"));

var _config = _interopRequireDefault(require("../config"));

var _room = _interopRequireDefault(require("../models/room"));

var _auth = _interopRequireDefault(require("../auth"));

var _session = _interopRequireDefault(require("../session"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Initialize Socket.io
 * Uses Redis as Adapter for Socket.io
 *
 */
var redisClient = _redis["default"].createClient;

var ioEvents = function ioEvents(io) {
  io.on('connection', function (socket) {
    console.log('socket connected');

    _auth["default"].getUserByToken(socket.handshake.query.token).then(function (user) {
      // Create a new room
      socket.on('createRoom', function (title) {
        console.log("createRoom");

        _room["default"].findOne({
          title: new RegExp("^".concat(title, "$"), 'i')
        }, function (err, room) {
          if (err) throw err;

          if (room) {
            socket.emit('updateRoomsList', {
              error: 'Room title already exists.'
            });
          } else {
            _room["default"].create({
              title: title
            }, function (error, newRoom) {
              if (error) throw error;
              socket.emit('updateRoomsList', newRoom);
              socket.broadcast.emit('updateRoomsList', newRoom);
            });
          }
        });
      }); // Join a chatroom

      socket.on('join', function (roomId) {
        console.log('on join');

        _room["default"].findById(roomId, function (err, room) {
          if (err) throw err;

          if (!room) {
            // Assuming that you already checked in router that chatroom exists
            // Then, if a room doesn't exist here, return an error to inform the client-side.
            socket.emit('updateUsersList', {
              error: 'Room doesnt exist.'
            });
          } else {
            // Check if user exists in the session
            if (user == null) {
              console.log("user doesn't exists in session");
              return;
            }

            _room["default"].addUser(room, socket, user._id, function (errAddUser, newRoom) {
              if (errAddUser) throw errAddUser;
              console.log("room add user"); // Join the room channel

              socket.join(newRoom.id);

              _room["default"].getUsers(newRoom, socket, user._id, function (errorGetUsers, users, cuntUserInRoom) {
                console.log("room getUsers");
                if (errorGetUsers) throw errorGetUsers; // Return list of all user connected to the room to the current user

                console.log("emitting updateUsersList");
                socket.emit('updateUsersList', users, true); // Return the current user to other connecting sockets in the room

                console.log("broad casting updateUsersList");
                socket.broadcast.to(newRoom.id).emit('updateUsersList', users[users.length - 1]);
              });
            });
          }
        });
      }); // When a socket exits

      socket.on('disconnect', function () {
        console.log("disconnect");

        if (user == null) {
          return;
        } // Find the room to which the socket is connected to,
        // and remove the current user + socket from this room


        _room["default"].removeUser(socket, user._id, function (err, room, userId, cuntUserInRoom) {
          if (err) throw err;
          console.log("leaving socket"); // Leave the room channel

          socket.leave(room.id); // Return the user id ONLY if the user was connected to the current room using
          // one socket
          // The user id will be then used to remove the user from users list on chatroom page

          socket.broadcast.to(room.id).emit('removeUser', userId);
        });
      }); // When a new message arrives

      socket.on('newMessage', function (roomId, message) {
        console.log('on new message');
        socket.broadcast.to(roomId).emit('addMessage', message);
      });
    })["catch"](function (error) {
      console.error(error);
    });
  });
};

var init = function init(app) {
  var server = _http["default"].Server(app);

  var io = (0, _socket2["default"])(server); // Force Socket.io to ONLY use "websockets"; No Long Polling.

  io.set('transports', ['websocket']); // Using Redis

  var port = _config["default"].redis.port;
  var host = _config["default"].redis.host;
  var password = _config["default"].redis.password;
  var pubClient = redisClient(port, host, {
    auth_pass: password
  });
  var subClient = redisClient(port, host, {
    auth_pass: password,
    return_buffers: true
  });
  io.adapter((0, _socket["default"])({
    pubClient: pubClient,
    subClient: subClient
  })); // Allow sockets to access session data

  io.use(function (socket, next) {
    (0, _session["default"])(socket.request, {}, next);
  }); // Define all Events

  ioEvents(io); // The server object will be then used to list to a port number

  return server;
};

var _default = init;
exports["default"] = _default;