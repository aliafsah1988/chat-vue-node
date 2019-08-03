import axios from 'axios'
import localSettings from '../localSettings'
import cookieHelper from '../../utils/cookieHelper'

class RestClient {
  constructor () {
    this.axios = axios
    this.localSettings = localSettings
  }
  checkResponse (response, reject) {
    switch (response.status) {
      case 200:
        return true
      case 400:
        return false
      case 401:

        return false
      case 404:

        return false
    }
    return false
  }
  login (username, password) {
    return new Promise((resolve, reject) => {
      console.log('log in ...')
      this.axios
        .create({
          baseURL: this.localSettings.base_url,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .post(this.localSettings.endpoints.login, {
          username: username,
          password: password
        })
        .then(response => {
          console.log(response)
          if (this.checkResponse(response, reject)) {
            resolve(response)
          } else reject(response.status)
        })
        .catch(function (error) {
          // if (error.response) {
          //   this.checkResponse(error.response, reject)
          // } else {
          console.log(error)
          reject(error)
          // }
        })
    })
  }
  logOut () {
    return new Promise((resolve, reject) => {
      // login with instantiate axios
      this.axios
        .create({
          baseURL: this.localSettings.base_url,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': this.auth.getToken()
          }
        })
        .post(this.localSettings.endpoints.user.logout, {})
        .then(response => {
          if (this.checkResponse(response)) {
            resolve()
          }
        })
        .catch(function (error) {
          if (error.response) {
            this.checkResponse(error.response, reject)
          } else {
            reject(error)
            console.log(error)
          }
        })
    })
  }
  register (username, password) {
    return new Promise((resolve, reject) => {
      console.log('register ...')
      this.axios
        .create({
          baseURL: this.localSettings.base_url,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .post(this.localSettings.endpoints.register, {
          username: username,
          password: password
        })
        .then(response => {
          console.log(response)
          if (this.checkResponse(response, reject)) {
            resolve(response)
          } else reject(response.status)
        })
        .catch(function (error) {
          // if (error.response) {
          //   this.checkResponse(error.response, reject)
          // } else {
          console.log(error)
          reject(error)
          // }
        })
    })
  }
  getRooms () {
    return new Promise((resolve, reject) => {
      console.log('getRooms ...')
      this.axios
        .create({
          baseURL: this.localSettings.base_url,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': cookieHelper.getToken()
          }
        })
        .get(this.localSettings.endpoints.getRooms)
        .then(response => {
          console.log(response)
          if (this.checkResponse(response, reject)) {
            resolve(response)
          } else reject(response.status)
        })
        .catch(function (error) {
          // if (error.response) {
          //   this.checkResponse(error.response, reject)
          // } else {
          console.log(error)
          reject(error)
          // }
        })
    })
  }
}
export default RestClient
