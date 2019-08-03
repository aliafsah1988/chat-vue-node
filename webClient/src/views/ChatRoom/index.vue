<template>
    <div class="container clearfix">
      <div class="chat">
        <div class="chat-header clearfix">
          <!-- <img src="<%= user.picture %>" alt="avatar"> -->
          <div class="chat-about">
            <div class="chat-room">{{ room.title }}</div>
            <div class="chat-num-users"> {{users.length}} User(s)</div>
          </div>
          <i class="fa fa-users"></i>
        </div> <!-- end chat-header -->

        <div class="chat-history">
          <ul v-for="message in messages" :key="message.date">
            <li>
              <div class="message-data" :class="{'my-message-data': message.isMine,
                'others-message-data': !message.isMine}">
                <span class="message-data-name">{{message.username}}</span>
                <span class="message-data-time">{{message.date}}</span>
              </div>
              <div
                class="message"
                :class="{'my-message': message.isMine,
                'others-message': !message.isMine}"
                dir="auto"
                >
               {{message.content}}
               </div>
            </li>
          </ul>
        </div> <!-- end chat-history -->

        <div class="chat-message clearfix">
          <textarea
          name="message"
           placeholder ="Type your message"
            rows="3"
            v-model="messageContent"
            ></textarea>
          <button type="submit" @click="sendMessage()">Send</button>
        </div> <!-- end chat-message -->
      </div> <!-- end chat -->

      <div class="controls">
          <a @click="logout" class="logout-btn">Logout</a>
          <a href="/rooms" class="rooms-btn">Rooms</a>
      </div>

      <div class="users-list">
        <ul class="list" v-for="user in users" :key="user._id">
          <li class="clearfix" :id="'user-'+ user._id">
            <!-- <img src="${user.picture}" alt="${user.username}" /> -->
            <div class="about">
              <div class="name">{{user.username}}</div>
              <div class="status"><i class="fa fa-circle online"></i> online</div>
            </div>
          </li>
        </ul>
      </div>
    </div> <!-- end container -->
</template>
<script>
import cookieHelper from '../../utils/cookieHelper'

export default {
  mounted () {
    console.log(`username: ${this.username}`)
    console.log(`room: ${JSON.stringify(this.room)}`)
    this.initSocket()
  },
  data () {
    return {
      messageContent: '',
      messages: [],
      users: [],
      username: cookieHelper.getUsername()
    }
  },
  props: {
    room: {
      type: Object,
      default: function () {
        return { title: '', id: 0 }
      }
    }
  },
  methods: {
    sendMessage () {
      if (this.messageContent !== '') {
        let message = {
          content: this.messageContent,
          username: this.username,
          date: Date.now()
        }
        this.$store.socket.emit('newMessage', this.room._id, message)
        this.messageContent = ''
        message.isMine = true
        this.addMessage(message)
      }
    },
    addMessage (message) {
      message.date = (new Date(message.date)).toLocaleString()
      this.messages.push(message)
    },
    initSocket () {
      this.$store.socket.emit('join', this.room._id)

      // Update users list upon emitting updateUsersList event
      this.$store.socket.on('updateUsersList', (users, clear) => {
        console.log(`updateUsersList`)
        console.log(JSON.stringify(users))
        // $('.container p.message').remove()
        if (users.error != null) {
          // $('.container').html(`<p class="message error">${users.error}</p>`)
        } else {
          this.updateUsersList(users, clear)
        }
      })

      // Whenever a user leaves the current room, remove the user from users list
      this.$store.socket.on('removeUser', (userId) => {
        console.log(`removeUser: ${userId}`)
        let index = this.users.findIndex((element) => {
          return element._id === userId
        })
        if (index > -1) this.users.splice(index, 1)
      })

      // Append a new message
      this.$store.socket.on('addMessage', (message) => {
        console.log(`addMessage: ${JSON.stringify(message)}`)
        this.addMessage(message)
      })
    },
    // Update users list
    updateUsersList (users, clear) {
      if (users.constructor !== Array) {
        users = [users]
      }
      for (var user of users) {
        this.users.push(user)
      }
    },
    logout () {
      this.$store.dispatch('logout')
      this.$store.socket.disconnect()
      this.$router.push({
        name: 'login',
        path: '/'
      })
    }
  }
}
</script>

<style>
@import url('./style.css');
</style>
