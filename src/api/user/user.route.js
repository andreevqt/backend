'use strict';

const { Router } = require('express');
const controller = require('./user.controller');
const validator = require('./user.validator');
const { validate, decodeJSON } = require('../../core/middleware');
const { createUpload } = require('../../core/image/image.middleware')
const { authorize, isCurrentUser } = require('./user.middleware');

const upload = createUpload();

const router = new Router();

module.exports = (app) => {
  app.use('/users', router);

  router.param('userId', controller.checkUser);

  router
    .route('/')
    .get(authorize(), controller.getByAccess)
    .post(upload('image'), validate(validator.create), controller.create);

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
    .post(authorize(), upload('image'), isCurrentUser, decodeJSON('body.attrs'), validate(validator.update, 'body.attrs'), controller.update);

  router
    .route('/:userId/likes')
    .get(validate(validator.pagination), controller.likes);
};
