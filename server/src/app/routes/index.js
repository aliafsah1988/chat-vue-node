
import httpStatus from 'http-status-codes'
import express from 'express'
import Room from '../models/room'
import auth from '../auth'

const router = express.Router()

// Home page
router.get('/', (req, res, next) => {
  // If user is already logged in, then redirect to rooms page
  if (req.isAuthenticated()) {
    res.redirect('/rooms')
  } else {
    res.render('login', {
      success: req.flash('success')[0],
      errors: req.flash('error'),
      showRegisterForm: req.flash('showRegisterForm')[0]
    })
  }
})

// Login
router.post('/login', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  auth.login(username, password, (error, user) => {
    if (error) res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
    else res.status(httpStatus.OK).send(user)
  })
})

// Register via username and password
router.post('/register', (req, res, next) => {
  const credentials = { username: req.body.username, password: req.body.password }

  if (credentials.username === '' || credentials.password === '') {
    res.status(httpStatus.BAD_REQUEST).send('Missing credentials')
  } else {
    auth.register(credentials, (error, data) => {
      if (error) res.status(httpStatus.NOT_ACCEPTABLE).send(error)
      else res.status(httpStatus.OK).send(data)
    })
  }
})

// Rooms
// router.get('/rooms', [User.isAuthenticated, function(req, res, next) {
// Room.find(function(err, rooms){
// if(err) throw err;
// res.status(httpStatus.OK).send({'rooms': rooms });
// });
// }]);

router.get('/rooms', auth.checkAuthForRequest, (req, res, next) => {
  Room.find((error, rooms) => {
    if (error) res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
    else res.status(httpStatus.OK).send({ rooms })
    return null
  })
})

// Chat Room
router.get('/chat/:id', auth.checkAuthForRequest, (req, res, next) => {
  const roomId = req.params.id
  Room.findById(roomId, (err, room) => {
    if (err) throw err
    if (!room) {
      return next()
    }
    res.render('chatroom', { user: req.user, room })
  })
})

// Logout
router.get('/logout', (req, res, next) => {
  // remove the req.user property and clear the login session
  req.logout()

  // destroy session data
  req.session = null

  // redirect to homepage
  res.redirect('/')
})

module.exports = router
