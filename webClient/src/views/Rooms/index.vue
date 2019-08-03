<template>
    <div class="container clearfix" style="width: 500px;">
      <div class="controls" style="border: none; width: 100%;">
          <a @click="logout()" class="logout-btn" style="width: auto; padding: 13px; font-size: 12px;">Logout</a>
      </div>

      <div class="room" style="width: 100%;">
        <div class="room-header clearfix">
          <div class="room-about">
            <div class="room-title">Rooms</div>
            <div class="room-num-rooms">{{ rooms.length }} Room(s)</div>
          </div>
          <i class="fa fa-th-list"></i>
        </div> <!-- end room-header -->

        <div class="room-create clearfix" style="border-bottom: 2px solid white;">
          <input type="text" name="title" autofocus placeholder ="Type a new room" v-model="title">
          <button @click="createRoom()">Create</button>
        </div> <!-- end room-create -->

        <div class="room-list" v-if="rooms.length > 0">
          <ul v-for="room in rooms" :key="room._id">
            <li class="room-item" @click="goToChatRoom(room)">{{room.title}}</li>
          </ul>
        </div> <!-- end room-list -->
        <p v-else class="message" style="text-align: center; padding: 0; margin: 0;">Create your first room!</p>
      </div> <!-- end room -->
    </div> <!-- end container -->
    </template>

<script>
import io from 'socket.io-client'

import localSettings from '../../api/localSettings'
import RestClient from '../../api/restClient'
import cookieHelper from '../../utils/cookieHelper'

export default {
  mounted () {
    this.getRooms()
    this.initSocket()
  },
  data () {
    return {
      rooms: [],
      title: '',
      restClient: new RestClient()
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
      this.socket.disconnect()
      this.$router.push({
        name: 'login',
        path: '/'
      })
    },
    getRooms () {
      this.restClient.getRooms()
        .then((response) => {
          this.rooms = response.data.rooms
        })
        .catch((error) => {
          console.error(error)
        })
    },
    createRoom () {
      try {
        let roomTitle = this.title.trim()
        if (roomTitle !== '') {
          console.log(`creating room`)
          this.$store.socket.emit('createRoom', roomTitle)
        }
      } catch (error) {
        console.error(error)
      }
    },
    initSocket () {
      console.log('initing socket')
      this.$store.socket = io(localSettings.base_url, {
        transports: ['websocket'],
        // extraHeaders: {
        //   username: 'ali'
        // }
        query: {
          token: cookieHelper.getToken()
        }
      })
      // this.socket = io(localSettings.base_url + '/rooms', { transports: ['websocket'] })
      // When socket connects, get a list of chatrooms
      this.$store.socket.on('connect', () => {
        console.log('socket connected')
        // Update rooms list upon emitting updateRoomsList event
        this.$store.socket.on('updateRoomsList', (room) => {
          console.log('updateRoomsList')
          // Display an error message upon a user error(i.e. creating a room with an existing title)
          // $('.room-create p.message').remove()
          if (room.error != null) {
            // $('.room-create').append(`<p class="message error">${room.error}</p>`)
            // TODO show error
          } else {
            this.updateRoomsList(room)
          }
        })
      })

      this.$store.socket.on('disconnect', function () {
        console.log('socket disconnect')
      })
    },
    // Update rooms list
    updateRoomsList: function (room) {
      room.title = room.title.length > 25 ? room.title.substr(0, 25) + '...' : room.title
      this.rooms.push(room)
    },
    goToChatRoom (room) {
      // "/chat/<%= room.id %>"
      console.log('go to chat room ...')
      this.$router.push({
        name: 'chatRoom',
        path: '/chatRoom:' + room._id,
        params: { room: room, id: room._id }
      })
    }
  }
}
</script>

<style>
@import url('./style.css');
</style>
