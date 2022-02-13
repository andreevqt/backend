'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const _ = require('lodash');
const { Model } = require('objection');
const path = require('path');
const {Http} = require('../constants');
const {logRequests, errorHandler} = require('../core/middleware');
const config = require('../config');
const connectToDb = require('./database');
const api = require('../api');

module.exports = async (app) => {
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

  // express
  app.use(express.json());
  app.use(express.urlencoded({
    extended: false
  }));

  app.use(cors());
  app.use(logRequests);

  app.use(config.get('app.prefix') || '/', api);

  app.use(express.static(path.resolve(__dirname, '../public')))
  app.use((req, res) => res.status(Http.NOT_FOUND).send('Not found'));
  app.use(errorHandler);
};
