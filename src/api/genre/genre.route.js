'use strict';

const { Router } = require('express');
const controller = require('./genre.controller');

const router = new Router();

module.exports = (app) => {
  app.use('/genres', router);

  router
    .route('/')
    .get(controller.list);
};
