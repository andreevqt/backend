'use strict';

const { Router } = require('express');
const controller = require('./movie.controller');
const { authorize } = require('../user/user.middleware');

const router = new Router();

module.exports = (app) => {
  app.use('/movies', router);

  router
    .route('/:movieId')
    .get(controller.get)

  router
    .route('/:movieId/likes')
    .get(controller.likes.get)
    .post(authorize, controller.likes.create);

  router
    .route('/:movieId/likes/:likeId')
    .delete(authorize, controller.likes.delete);

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
