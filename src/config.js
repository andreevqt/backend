'use strict';

require('dotenv').config();

const _ = require('lodash');
const ms = require('ms');

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

const getList = (envVar, defaultValue) => {
  return envVar ? envVar.split(',') : defaultValue;
};

const getTime = (envVar, defaultValue) => {
  return envVar ? ms(envVar) : ms(defaultValue)
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
  scraper: {
    rucaptchaKey: getString(process.env.RUCAPTCHA_KEY),
    proxy: getString(process.env.SCRAPER_PROXY),
    headless: getBool(process.env.SCRAPER_HEADLESS, true),
    queueCapacity: getInteger(process.env.SCRAPER_QUEUE_CAPACITY, 100),
    maxConcurrency: getInteger(process.env.SCRAPER_MAX_CONCURRENCY, 4)
  },
  rotator: {
    proxyList: getList(process.env.ROTATOR_PROXY_LIST),
    port: getString(process.env.ROTATOR_PORT, 8000),
    frequency: getTime(process.env.ROTATOR_FREQUENCY, '15m')
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
