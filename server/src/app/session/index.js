
import session from 'express-session'
import connectMongo from 'connect-mongo'
import db from '../database'
import config from '../config'

const MongoStore = connectMongo(session)

/**
 * Initialize Session
 * Uses MongoDB-based session store
 *
 */
const init = () => {
  if (process.env.NODE_ENV === 'production') {
    return session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      unset: 'destroy',
      store: new MongoStore({ mongooseConnection: db.Mongoose.connection })
    })
  }
  return session({
    secret: config.sessionSecret,
    resave: false,
    unset: 'destroy',
    saveUninitialized: true
  })
}

module.exports = init()
