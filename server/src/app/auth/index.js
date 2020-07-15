
import httpStatus from 'http-status-codes'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/user'
import config from '../config'

module.exports = {
  getUserByToken: (token) => {
    console.log(`getUserByToken`)
    return new Promise((resolve, reject) => {
      console.log(`token: ${token}`)
      jwt.verify(token, config.secret, (error, decoded) => {
        if (error) { reject() }
        console.log(`verify Token: ${JSON.stringify(decoded)}`)
        User.findOne({ _id: decoded.id }, (err, user) => {
          if (err) { reject() } else if (!user) {
            reject()
          }
          console.log(`resolving user by token`)
          resolve(user)
        })
      })
    })
  },
  checkAuthForRequest: (req, res, next) => {
    try {
      console.log(`checkAuthForRequest`)
      const token = req.headers['x-access-token']
      if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).send()
      }
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) { return res.status(httpStatus.UNAUTHORIZED).send(err) }
        console.log(`verify Token: ${JSON.stringify(decoded)}`)
        User.findOne({ _id: decoded.id }, (error, user) => {
          if (error) { return res.status(httpStatus.UNAUTHORIZED).send(error) }
          if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).send()
          }
          next()
        })
      })
    } catch (err) {
      if (err) { return res.status(httpStatus.UNAUTHORIZED).send() }
    }
  },
  login: (username, password, done) => {
    try {
      console.log(`auth login`)
      User.findOne({ username: new RegExp(username, 'i'), socialId: null }, (err, user) => {
        if (err) {
          console.error(err)
          return done(err, null)
        }

        if (!user) {
          return done('Incorrect username or password.', null)
        }
        // let passwordIsValid = bcrypt.compareSync(password, user.password);
        // if (!passwordIsValid){
        // return done('Incorrect username or password.', null);
        // }
        const token = jwt.sign(
          {
            id: user._id
          },
          config.secret
          // {
          //   // expiresIn: 86400 // expires in 24 hours
          // }
        )
        return done(null, { user, 'x-access-token': token })
      })
    } catch (err) {
      if (err) { return done(err, null) }
    }
  },
  register: (inputCredentials, done) => {
    console.log(`auth register`)
    const credentials = { ...inputCredentials }
    const hashedPassword = bcrypt.hashSync(credentials.password, 8)
    credentials.password = hashedPassword
    User.findOne({
      username: new RegExp(`^${credentials.username}$`, 'i'),
      socialId: null
    }, (err, user) => {
      if (err) return done(err, null)
      if (user) {
        return done('User already exists', null)
      }
      User.create(credentials, (error, newUser) => {
        if (error) return done(error, null)

        const token = jwt.sign(
          {
            id: newUser._id
          },
          config.secret
          // {
          //   // expiresIn: 86400 // expires in 24 hours
          // }
        )
        return done(null, { user: newUser, 'x-access-token': token })
      })
    })
  }
}
