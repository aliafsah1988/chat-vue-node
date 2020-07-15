
import database from '../database'
import User from './user'

const RoomModel = database.models.room

const create = (data, callback) => {
  const newRoom = new RoomModel(data)
  newRoom.save(callback)
}

const find = (data, callback) => {
  RoomModel.find(data, callback)
}

const findOne = (data, callback) => {
  RoomModel.findOne(data, callback)
}

const findById = (id, callback) => {
  RoomModel.findById(id, callback)
}

// const findByIdAndUpdate = (id, data, callback) => {
//   RoomModel.findByIdAndUpdate(id, data, { new: true }, callback)
// }

/**
 * Add a user along with the corresponding socket to the passed room
 *
 */
const addUser = (room, socket, userId, callback) => {
  // Get current user's id
  // var userId = socket.request.session.passport.user;
  // var userId = socket.handshake.query.user._id;

  // Push a new connection object(i.e. {userId + socketId})
  const conn = { userId, socketId: socket.id }
  room.connections.push(conn)
  room.save(callback)
}

/**
 * Get all users in a room
 *
 */
const getUsers = (room, socket, userId, callback) => {
  const users = []
  const vis = {}
  let cunt = 0
  // var userId = socket.handshake.query.user._id;

  // Loop on room's connections, Then:
  room.connections.forEach((conn) => {
    // 1. Count the number of connections of the
    // current user(using one or more sockets) to the passed room.
    if (conn.userId === userId) {
      cunt += 1
    }

    // 2. Create an array(i.e. users) contains unique users' ids
    if (!vis[conn.userId]) {
      users.push(conn.userId)
    }
    vis[conn.userId] = true
  })

  // Loop on each user id, Then:
  // Get the user object by id, and assign it to users array.
  // So, users array will hold users' objects instead of ids.
  let loadedUsers = 0
  users.forEach((user_Id, i) => {
    User.findById(user_Id, (err, user) => {
      if (err) { return callback(err) }
      users[i] = user

      // fire callback when all users are loaded (async) from database
      loadedUsers += 1
      if (loadedUsers === users.length) {
        return callback(null, users, cunt)
      }
    })
  })
}

/**
 * Remove a user along with the corresponding socket from a room
 *
 */
const removeUser = (socket, userId, callback) => {
  // Get current user's id
  // var userId = socket.handshake.query.user._id;

  find((err, rooms) => {
    if (err) { return callback(err) }

    // Loop on each room, Then:
    rooms.every((room) => {
      let pass = true; let cunt = 0; let
        target = 0

      // For every room,
      // 1. Count the number of connections of the current user(using one or more sockets).
      room.connections.forEach((conn, i) => {
        if (conn.userId === userId) {
          cunt += 1
        }
        if (conn.socketId === socket.id) {
          pass = false
          target = i
        }
      })

      // 2. Check if the current room has the disconnected socket,
      // If so, then, remove the current connection object, and terminate the loop.
      if (!pass) {
        room.connections.id(room.connections[target]._id).remove()
        room.save((error) => {
          callback(error, room, userId, cunt)
        })
      }

      return pass
    })
  })
}

export default {
  create,
  find,
  findOne,
  findById,
  addUser,
  getUsers,
  removeUser
}
