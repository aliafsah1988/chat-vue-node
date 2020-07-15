export default {
  db: {
    username: '',
    password: '',
    host: '127.0.0.1',
    port: '27017',
    name: 'ChatApp'
  },
  sessionSecret: '123',
  facebook: {
    clientID: '<AppID>',
    clientSecret: '<AppSecret>',
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos']
  },
  twitter: {
    consumerKey: '<ConsumerKey>',
    consumerSecret: '<ConsumerSecret>',
    callbackURL: '/auth/twitter/callback',
    profileFields: ['id', 'displayName', 'photos']
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: ''
  },
  secret: 'supersecret'
}
