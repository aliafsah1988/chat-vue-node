import Cookies from 'js-cookie'

const usernameKey = 'username'
const passwordKey = 'password'
const userIdKey = 'userId'
const tokenKey = 'token'

export default {
  getUsername () {
    return Cookies.get(usernameKey)
  },
  getPassword () {
    return Cookies.get(passwordKey)
  },
  getuserId () {
    return Cookies.get(userIdKey)
  },
  getToken () {
    return Cookies.get(tokenKey)
  },
  setUsername (username) {
    return Cookies.set(usernameKey, username)
  },
  setPassword (password) {
    return Cookies.set(passwordKey, password)
  },
  setUserId (userId) {
    return Cookies.set(userIdKey, userId)
  },
  setToken (token) {
    return Cookies.set(tokenKey, token)
  },
  removeUsername () {
    console.log(`removeUsername`)
    return Cookies.remove(usernameKey)
  },
  removePassword () {
    console.log(`removePassword`)
    return Cookies.remove(passwordKey)
  },
  removeUserId () {
    console.log(`removeUserId`)
    return Cookies.remove(userIdKey)
  },
  removeToken () {
    console.log(`removeToken`)
    return Cookies.remove(tokenKey)
  }
}
