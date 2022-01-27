'use strict';

const { Router } = require('express');
const controller = require('./user.controller');
const validator = require('./user.validator');
const { validate } = require('../../core/middleware');

const router = new Router();

module.exports = (app) => {
  app.use('/users', router);

  router.param('userId', controller.checkUser);

  router
    .route('/')
    .get(controller.list)
    .post(validate(validator.create), controller.create);

  router
    .route('/:userId')
    .get(controller.get);

  router
    .route('/token')
    .post(controller.token);

  router
    .route('/login')
    .post(controller.login);
};
