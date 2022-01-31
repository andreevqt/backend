'use strict';

const { Router } = require('express');
const controller = require('./person.controller');
const { authorize } = require('../user/user.middleware');

const router = new Router();

module.exports = (app) => {
  app.use('/persons', router);

  router
    .route('/:personId')
    .get(controller.get);

  router
    .route('/:personId/likes')
    .get(controller.likes.get)
    .post(authorize, controller.likes.create)
    .delete(authorize, controller.likes.delete);

  router
    .route('/popular')
    .get(controller.popular);

  router
    .route('/:personId/credits')
    .get(controller.credits);
};
