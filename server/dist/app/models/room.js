"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = _interopRequireDefault(require("../database"));

var _user = _interopRequireDefault(require("./user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var RoomModel = _database["default"].models.room;

var create = function create(data, callback) {
  var newRoom = new RoomModel(data);
  newRoom.save(callback);
};

var find = function find(data, callback) {
  RoomModel.find(data, callback);
};

var findOne = function findOne(data, callback) {
  RoomModel.findOne(data, callback);
};

var findById = function findById(id, callback) {
  RoomModel.findById(id, callback);
}; // const findByIdAndUpdate = (id, data, callback) => {
//   RoomModel.findByIdAndUpdate(id, data, { new: true }, callback)
// }

/**
 * Add a user along with the corresponding socket to the passed room
 *
 */


var addUser = function addUser(room, socket, userId, callback) {
  // Get current user's id
  // var userId = socket.request.session.passport.user;
  // var userId = socket.handshake.query.user._id;
  // Push a new connection object(i.e. {userId + socketId})
  var conn = {
    userId: userId,
    socketId: socket.id
  };
  room.connections.push(conn);
  room.save(callback);
};
/**
 * Get all users in a room
 *
 */


var getUsers = function getUsers(room, socket, userId, callback) {
  var users = [];
  var vis = {};
  var cunt = 0; // var userId = socket.handshake.query.user._id;
  // Loop on room's connections, Then:

  room.connections.forEach(function (conn) {
    // 1. Count the number of connections of the
    // current user(using one or more sockets) to the passed room.
    if (conn.userId === userId) {
      cunt += 1;
    } // 2. Create an array(i.e. users) contains unique users' ids


    if (!vis[conn.userId]) {
      users.push(conn.userId);
    }

    vis[conn.userId] = true;
  }); // Loop on each user id, Then:
  // Get the user object by id, and assign it to users array.
  // So, users array will hold users' objects instead of ids.

  var loadedUsers = 0;
  users.forEach(function (user_Id, i) {
    _user["default"].findById(user_Id, function (err, user) {
      if (err) {
        return callback(err);
      }

      users[i] = user; // fire callback when all users are loaded (async) from database

      loadedUsers += 1;

      if (loadedUsers === users.length) {
        return callback(null, users, cunt);
      }
    });
  });
};
/**
 * Remove a user along with the corresponding socket from a room
 *
 */


var removeUser = function removeUser(socket, userId, callback) {
  // Get current user's id
  // var userId = socket.handshake.query.user._id;
  find(function (err, rooms) {
    if (err) {
      return callback(err);
    } // Loop on each room, Then:


    rooms.every(function (room) {
      var pass = true;
      var cunt = 0;
      var target = 0; // For every room,
      // 1. Count the number of connections of the current user(using one or more sockets).

      room.connections.forEach(function (conn, i) {
        if (conn.userId === userId) {
          cunt += 1;
        }

        if (conn.socketId === socket.id) {
          pass = false;
          target = i;
        }
      }); // 2. Check if the current room has the disconnected socket,
      // If so, then, remove the current connection object, and terminate the loop.

      if (!pass) {
        room.connections.id(room.connections[target]._id).remove();
        room.save(function (error) {
          callback(error, room, userId, cunt);
        });
      }

      return pass;
    });
  });
};

var _default = {
  create: create,
  find: find,
  findOne: findOne,
  findById: findById,
  addUser: addUser,
  getUsers: getUsers,
  removeUser: removeUser
};
exports["default"] = _default;