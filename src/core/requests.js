'use strict';

const axios = require('axios');
const config = require('../config');

const baseURL = `${config.get('theMovieDb.baseUrl')}/${config.get('theMovieDb.version')}`;

const tmdb = axios.create({
  baseURL,
  headers: {
    ['Content-Type']: 'application/json;charset=utf-8'
  }
});

tmdb.interceptors.request.use((cfg) => ({
  ...cfg,
  params: {
    ...cfg.params,
    api_key: config.get('theMovieDb.key'),
    language: config.get('theMovieDb.lang')
  }
}));

module.exports = {
  tmdb
};
