'use strict';

require('dotenv').config();

const _ = require('lodash');

const getBool = (envVar, defaultValue) => {
  if (_.isBoolean(envVar)) {
    return envVar;
  }

  if (_.isString(envVar)) {
    if (envVar === 'true') return true;
    if (envVar === 'false') return false;
  }

  return defaultValue;
};

const getString = (envVar, defaultValue) => {
  return envVar || defaultValue;
};

const getInteger = (envVar, defaultValue) => {
  if (_.isInteger(envVar)) {
    return envVar;
  }

  if (_.isString(envVar)) {
    return _.toInteger(envVar);
  }

  return defaultValue;
};

const config = {
  port: getInteger(process.env.SERVER_PORT, 3000),
  apiKey: getString(process.env.API_KEY),
  db: {
    user: getString(process.env.DB_USER),
    password: getString(process.env.DB_PASSWORD),
    database: getString(process.env.DB_DATABASE),
    host: getString(process.env.DB_HOST, 'localhost'),
    client: 'mysql'
  }
};

const get = (key) => {
  return _.get(config, key);
};

const set = (key, value) => {
  _.set(config, key, value);
};

module.exports = {
  get,
  set
};
