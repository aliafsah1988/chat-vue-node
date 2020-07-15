
import Mongoose from 'mongoose'
import config from '../config'
import UserModel from './schemas/user'
import RoomModel from './schemas/room'

// Connect to the database
// construct the database URI and encode username and password.
const dbURI = `mongodb://${
  // encodeURIComponent(config.db.username) + ":" +
  // encodeURIComponent(config.db.password) + "@" +
  config.db.host}:${
  config.db.port}/${
  config.db.name}`
Mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })

// Throw an error if the connection fails
Mongoose.connection.on('error', (err) => {
  // if(err) throw err;
  if (err) console.error(err)
})

// mpromise (mongoose's default promise library) is deprecated,
// Plug-in your own promise library instead.
// Use native promises
Mongoose.Promise = global.Promise

export default {
  Mongoose,
  models: {
    user: UserModel,
    room: RoomModel
  }
}
