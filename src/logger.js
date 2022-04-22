'use strict';

const pino = require('pino');

const options = {
  name: 'pino-and-express',
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: {
    translateTime: 'SYS:standard'
  },
  forceColor: true,
  timestamps: true
};

const destination = process.env.NODE_ENV === 'production'
  ? pino.destination('logs/server.log')
  : undefined;

module.exports = pino(options, destination);
