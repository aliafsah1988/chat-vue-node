
import winston from 'winston'

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      level: 'debug',
      json: true,
      filename: './debug.log',
      handleExceptions: true
    }),
    new (winston.transports.Console)({
      level: 'debug',
      json: true,
      handleExceptions: true
    })
  ],
  exitOnError: false
})

module.exports = logger
