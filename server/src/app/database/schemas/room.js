
import Mongoose from 'mongoose'

/**
 * Each connection object represents a user connected through a unique socket.
 * Each connection object composed of {userId + socketId}. Both of them together are unique.
 *
 */
const RoomSchema = new Mongoose.Schema({
  title: { type: String, required: true },
  connections: { type: [{ userId: String, socketId: String }] }
})

const roomModel = Mongoose.model('room', RoomSchema)

module.exports = roomModel
