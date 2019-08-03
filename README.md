# chat vue node
A Real Time Chat Application built using Vue.js, Node.js, Express, Mongoose, Socket.io, JWT, & Redis.

## Index
+ [Features](#features)
+ [Installation](#installation)
+ [How It Works](#how-it-works)
+ [Support](#support)
+ [Contribute](#contribute)
+ [License](#license)

## Server Features
+ Uses Express as the application Framework.
+ Manages Sessions using [express-session](https://github.com/expressjs/session) package.
+ Authenticates via username and password using [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).
+ Passwords are hashed using [bcrypt-nodejs](https://github.com/shaneGirish/bcrypt-nodejs) package.
+ Real-time communication between a client and a server using [Socket.io](https://github.com/socketio/socket.io).
+ Uses [MongoDB](https://github.com/mongodb/mongo), [Mongoose](https://github.com/Automattic/mongoose) and [MongoLab(mLab)](https://mlab.com/) for storing and querying data.
+ Stores session in a [MongoDB](https://github.com/mongodb/mongo) using [connect-mongo](https://github.com/kcbanner/connect-mongo); a MongoDB-based session store.
+ Uses [Redis](https://github.com/antirez/redis) as an Adapter for [Socket.io](https://github.com/socketio/socket.io).
+ Logging Errors and Exceptions using [Winston](https://github.com/winstonjs/winston).

## Web Client Features
+ Uses Vue.js as the application Framework [vue](https://github.com/vuejs/vue).
+ Hit Server's Endpints with [axios](https://github.com/axios/axios) package.
+ Connects via statefull connection with [socket.io-client](https://github.com/socketio/socket.io-client).
+ Manages routes with vue-router [vue-router](https://github.com/vuejs/vue-router).
+ Uses js-cookie for managing cookies [vue-router](https://github.com/js-cookie/js-cookie).
+ Uses Vuex for state management [vuex](https://github.com/vuejs/vuex).


## Installation
### Running Locally
Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

- Clone or Download the repository
	clone https://github.com/aliafsah1988/chat-vue-node.git

- For running server
1. got to chat-vue-node/server
2. Install Dependencies
	$ npm install
3. Edit configuration file in _app/config/config.json_ with your credentials(see [Setup Configurations](#configurations)).
4. Download and Install [Redis](http://redis.io/download).
   If your development enviroment is Windows use this [Redis](https://github.com/rgl/redis/downloads).
5. Running Redis Server(as Admin)
	$ redis-server
6. Start the application
	$ npm start
   Your app should now be running on [localhost:3000](http://localhost:3000/).

- For running client vue.js app
1. got to chat-vue-node/webClient
2. Install Dependencies
	$ npm install
6. Start the application
	$ npm run serve
