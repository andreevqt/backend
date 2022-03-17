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
  debug: getBool(process.env.DEBUG, false),
  app: {
    port: getInteger(process.env.APP_PORT, 3000),
    secret: getString(process.env.APP_SECRET),
    prefix: getString(process.env.API_PREFIX, '/'),
    url: getString(process.env.APP_URL, 'http://localhost'),
  },
  db: {
    user: getString(process.env.DB_USER),
    password: getString(process.env.DB_PASSWORD),
    database: getString(process.env.DB_DATABASE),
    host: getString(process.env.DB_HOST, 'localhost'),
    client: 'mysql'
  },
  theMovieDb: {
    baseUrl: getString(process.env.MOVIE_DB_URL, 'https://api.themoviedb.org'),
    version: getInteger(process.env.MOVIE_DB_VERSION, 3),
    key: getString(process.env.MOVIE_DB_KEY),
    lang: getString(process.env.MOVIE_DB_LANG, 'ru')
  },
  jwt: {
    expiresIn: getString(process.env.JWT_EXPIRES_IN, '15m')
  }
};

const get = (key) => {
  return _.get(config, key);
};

const set = (key, value) => {
  _.set(config, key, value);
};

let fullUrl = get('app.url');
if (process.env !== 'production') {
  fullUrl += `:${get('app.port')}`;
}

set('app.fullUrl', fullUrl)

module.exports = {
  get,
  set
};
