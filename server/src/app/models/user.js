
import database from '../database'

const userModel = database.models.user

const create = (data, callback) => {
  const newUser = new userModel(data)
  newUser.save(callback)
}

const findOne = (data, callback) => {
  userModel.findOne(data, callback)
}

const findById = (id, callback) => {
  userModel.findById(id, callback)
}

/**
 * Find a user, and create one if doesn't exist already.
 * This method is used ONLY to find user accounts registered via Social Authentication.
 *
 */
const findOrCreate = (data, callback) => {
  findOne({ socialId: data.id }, (err, user) => {
    if (err) { return callback(err) }
    if (user) {
      return callback(err, user)
    }
    const userData = {
      username: data.displayName,
      socialId: data.id,
      picture: data.photos[0].value || null
    }

    // To avoid expired Facebook CDN URLs
    // Request user's profile picture using user id
    // @see http://stackoverflow.com/a/34593933/6649553
    if (data.provider === 'facebook' && userData.picture) {
      userData.picture = `http://graph.facebook.com/${data.id}/picture?type=large`
    }

    create(userData, (error, newUser) => {
      callback(error, newUser)
    })
  })
}

/**
 * A middleware allows user to get access to pages ONLY if the user is already logged in.
 *
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(401).send()
  }
}

export default {
  create,
  findOne,
  findById,
  findOrCreate,
  isAuthenticated
}
