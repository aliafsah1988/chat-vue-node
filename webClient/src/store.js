import Vue from 'vue'
import Vuex from 'vuex'
import cookeHelper from './utils/cookieHelper.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: cookeHelper.getUsername(),
    password: cookeHelper.getPassword(),
    userId: cookeHelper.getuserId(),
    token: cookeHelper.getToken(),
    socket: null
  },
  mutations: {
    SET_USERNAME: (state, username) => {
      state.username = username
      cookeHelper.setUsername(username)
    },
    SET_PASSWORD: (state, password) => {
      state.password = password
      cookeHelper.setPassword(password)
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId
      cookeHelper.setUserId(userId)
    },
    SET_TOKEN: (state, token) => {
      state.token = token
      cookeHelper.setToken(token)
    },
    LOGOUT: (state) => {
      state.token = ''
      state.userId = ''
      state.password = ''
      state.username = ''
      cookeHelper.removePassword()
      cookeHelper.removeToken()
      cookeHelper.removeUserId()
      cookeHelper.removeUsername()
    }
  },
  actions: {
    setUsername ({ commit }, username) {
      console.log('setUsername')
      commit('SET_USERNAME', username)
    },
    setPassword ({ commit }, password) {
      console.log('setPassword')
      commit('SET_PASSWORD', password)
    },
    setUserId ({ commit }, userId) {
      console.log('setUserId')
      commit('SET_USER_ID', userId)
    },
    setToken ({ commit }, token) {
      console.log('setUserId')
      commit('SET_TOKEN', token)
    },
    logout ({ commit }) {
      commit('LOGOUT')
    }
  },
  getters: {
    username: state => state.username,
    password: state => state.password,
    userId: state => state.userId,
    token: state => state.token
  }
})
