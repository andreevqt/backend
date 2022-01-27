'use strict';

const { Router } = require('express');
const controller = require('./person.controller');

const router = new Router();

module.exports = (app) => {
  app.use('/persons', router);

  router
    .route('/:personId')
    .get(controller.get);

  router
    .route('/popular')
    .get(controller.popular);

  router
    .route('/:personId/credits')
    .get(controller.credits);

};
