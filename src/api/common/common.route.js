'use strict';

const { Router } = require('express');
const controller = require('./common.controller');

const router = new Router();

module.exports = (app) => {
  app.use('/common', router);

  router
    .route('/configuration')
    .get(controller.configuration)
};
