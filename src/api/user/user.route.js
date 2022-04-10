'use strict';

const { Router } = require('express');
const controller = require('./user.controller');
const validator = require('./user.validator');
const { validate } = require('../../core/middleware');
const { upload } = require('../../core/image/image.middleware')
const { authorize, isCurrentUser } = require('./user.middleware');

const router = new Router();

module.exports = (app) => {
  app.use('/users', router);

  router.param('userId', controller.checkUser);

  router
    .route('/')
    .get(authorize(), controller.getByAccess)
    .post(upload.single('avatar'), validate(validator.create), controller.create);

  router
    .route('/token')
    .post(validate(validator.token), controller.token);

  router
    .route('/login')
    .post(validate(validator.login), controller.login);

  router
    .route('/logout')
    .post(validate(validator.logout), controller.logout);

  router
    .route('/:userId')
    .get(controller.get)
    .put(authorize(), isCurrentUser, validate(validator.update), controller.update);

  router
    .route('/:userId/likes')
    .get(validate(validator.pagination), controller.likes);
};
