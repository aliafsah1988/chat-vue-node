<template>
    <div class="login-page">
      <div class="form">
        <div style="background-color: gainsboro;margin-bottom: 10px;">
          Some Chat App
        </div>

        <div style="margin-top: 18px;">
            <div class="register-form" v-if="showRegisterForm">
              <input type="text" name="username" placeholder="username" v-model="username"/>
              <input type="password" name="password" placeholder="password" v-model="password"/>
              <button type="submit" @click="register()">create</button>
              <p class="message">Already registered? <a href="#" @click="showRegisterForm = false">Sign In</a></p>
            </div>

            <div class="login-form" v-if="!showRegisterForm">
              <input type="text" name="username" placeholder="username"  v-model="username"/>
              <input type="password" name="password" placeholder="password" v-model="password"/>
              <button type="submit" @click="login()">login</button>
              <p class="message">Not registered? <a href="#" @click="showRegisterForm=true">Create an account</a></p>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import localSettings from '../../api/localSettings'
import RestClient from '../../api/restClient'

export default {
  data () {
    return {
      username: '',
      password: '',
      showRegisterForm: false,
      localSettings: localSettings,
      restClient: new RestClient()
    }
  },
  methods: {
    register () {
      this.restClient.register(this.username, this.password)
        .then((response) => {
          console.log(`${JSON.stringify(response)}`)
          this.$store.dispatch('setToken', response.data['x-access-token'])
          this.$store.dispatch('setUsername', this.username)
          this.$store.dispatch('setPassword', this.password)
          this.$router.push('/rooms')
        })
        .catch((error) => {
          console.error(error)
        })
    },

    login () {
      this.restClient.login(this.username, this.password)
        .then((response) => {
          console.log(`${JSON.stringify(response)}`)
          this.$store.dispatch('setToken', response.data['x-access-token'])
          this.$store.dispatch('setUsername', this.username)
          this.$store.dispatch('setPassword', this.password)
          this.$store.dispatch('setUserId', response.data.user._id)
          this.$router.push('/rooms')
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

}
</script>

<style>
@import url('./style.css');
</style>
