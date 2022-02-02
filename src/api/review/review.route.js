'ust strict';

const { Router } = require('express');
const controller = require('./review.controller');
const validate = require('../../core/middleware/validate');
const validator = require('./review.validator');
const { isAuthor } = require('./review.middleware');
const { authorize } = require('../user/user.middleware');

const router = new Router();

module.exports = (app) => {
  app.use('/reviews', router);

  router
    .param('reviewId', controller.checkReview);

  router
    .route('/')
    .get(controller.list);

  router
    .route('/:reviewId')
    .get(controller.get)
    .put(authorize, isAuthor, validate(validator.update), controller.update)
    .delete(authorize, isAuthor, controller.delete);
};
