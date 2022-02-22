'use strict';

const { Router } = require('express');
const controller = require('./genre.controller');

const router = new Router();

module.exports = (app) => {
  app.use('/genres', router);

  router
    .param('genreId', controller.checkGenre);

  router
    .route('/')
    .get(controller.list);

  router
    .route('/:genreId')
    .get(controller.get);
};
