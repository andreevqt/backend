'use strict';

const { Router } = require('express');
const controller = require('./movie.controller');

const router = new Router();

module.exports = (app) => {
  app.use('/movies', router);

  router
    .route('/')
    .get(controller.list);

};
