'use strict';

const { Router } = require('express');
const controller = require('./movie.controller');

const router = new Router();

module.exports = (app) => {
  app.use('/movies', router);

  router
    .route('/popular')
    .get(controller.popular);

  router
    .route('/top_rated')
    .get(controller.topRated);

  router
    .route('/upcoming')
    .get(controller.upcoming);
};
