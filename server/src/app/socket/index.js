
import redis from 'redis'
import adapter from 'socket.io-redis'
import http from 'http'
import socketIo from 'socket.io'
import config from '../config'
import Room from '../models/room'
import auth from '../auth'

import session from '../session'

/**
 * Initialize Socket.io
 * Uses Redis as Adapter for Socket.io
 *
 */

const redisClient = redis.createClient

const ioEvents = (io) => {
  io.on('connection', (socket) => {
    console.log('socket connected')

    auth.getUserByToken(socket.handshake.query.token)
      .then((user) => {
        // Create a new room
        socket.on('createRoom', (title) => {
          console.log(`createRoom`)
          Room.findOne({ title: new RegExp(`^${title}$`, 'i') }, (err, room) => {
            if (err) throw err
            if (room) {
              socket.emit('updateRoomsList', { error: 'Room title already exists.' })
            } else {
              Room.create({
                title
              }, (error, newRoom) => {
                if (error) throw error
                socket.emit('updateRoomsList', newRoom)
                socket.broadcast.emit('updateRoomsList', newRoom)
              })
            }
          })
        })

        // Join a chatroom
        socket.on('join', (roomId) => {
          console.log('on join')
          Room.findById(roomId, (err, room) => {
            if (err) throw err
            if (!room) {
              // Assuming that you already checked in router that chatroom exists
              // Then, if a room doesn't exist here, return an error to inform the client-side.
              socket.emit('updateUsersList', { error: 'Room doesnt exist.' })
            } else {
              // Check if user exists in the session
              if (user == null) {
                console.log(`user doesn't exists in session`)
                return
              }

              Room.addUser(room, socket, user._id, (errAddUser, newRoom) => {
                if (errAddUser) throw errAddUser
                console.log(`room add user`)
                // Join the room channel
                socket.join(newRoom.id)

                Room.getUsers(newRoom, socket, user._id, (errorGetUsers, users, cuntUserInRoom) => {
                  console.log(`room getUsers`)
                  if (errorGetUsers) throw errorGetUsers

                  // Return list of all user connected to the room to the current user
                  console.log(`emitting updateUsersList`)
                  socket.emit('updateUsersList', users, true)

                  // Return the current user to other connecting sockets in the room
                  console.log(`broad casting updateUsersList`)
                  socket.broadcast.to(newRoom.id).emit('updateUsersList', users[users.length - 1])
                })
              })
            }
          })
        })

        // When a socket exits
        socket.on('disconnect', () => {
          console.log(`disconnect`)
          if (user == null) {
            return
          }
          // Find the room to which the socket is connected to,
          // and remove the current user + socket from this room
          Room.removeUser(socket, user._id, (err, room, userId, cuntUserInRoom) => {
            if (err) throw err

            console.log(`leaving socket`)
            // Leave the room channel
            socket.leave(room.id)

            // Return the user id ONLY if the user was connected to the current room using
            // one socket
            // The user id will be then used to remove the user from users list on chatroom page
            socket.broadcast.to(room.id).emit('removeUser', userId)
          })
        })

        // When a new message arrives
        socket.on('newMessage', (roomId, message) => {
          console.log('on new message')
          socket.broadcast.to(roomId).emit('addMessage', message)
        })
      })
      .catch((error) => {
        console.error(error)
      })
  })
}

const init = (app) => {
  const server = http.Server(app)
  const io = socketIo(server)

  // Force Socket.io to ONLY use "websockets"; No Long Polling.
  io.set('transports', ['websocket'])

  // Using Redis
  const port = config.redis.port
  const host = config.redis.host
  const password = config.redis.password
  const pubClient = redisClient(port, host, { auth_pass: password })
  const subClient = redisClient(port, host, { auth_pass: password, return_buffers: true })
  io.adapter(adapter({ pubClient, subClient }))

  // Allow sockets to access session data
  io.use((socket, next) => {
    session(socket.request, {}, next)
  })

  // Define all Events
  ioEvents(io)

  // The server object will be then used to list to a port number
  return server
}

export default init
