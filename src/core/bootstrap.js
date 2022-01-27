'use strict';

const axios = require('axios');
const _ = require('lodash');
const { Model } = require('objection');
const config = require('../config');
const connectToDb = require('./database');

module.exports = async () => {
  // bootstrap axios
  const baseUrl = `${config.get('theMovieDb.baseUrl')}/${config.get('theMovieDb.version')}`;

  axios.defaults.baseURL = baseUrl;
  axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
  axios.defaults.headers.params = axios.defaults.headers.params || {};
  axios.interceptors.request.use((cfg) => ({
    ...cfg,
    params: {
      ...cfg.params,
      api_key: config.get('theMovieDb.key'),
      language: config.get('theMovieDb.lang')
    }
  }));

  // init db
  const knex = await connectToDb();
  Model.knex(knex);
};
