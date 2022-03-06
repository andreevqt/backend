'ust strict';

const { Router } = require('express');
const controller = require('./review.controller');
const validate = require('../../core/middleware/validate');
const reviewValidator = require('./review.validator');
const commentValidator = require('../comment/comment.validator');
const { isAuthor } = require('./review.middleware');
const { authorize } = require('../user/user.middleware');

const router = new Router();

module.exports = (app) => {
  app.use('/reviews', router);

  router
    .param('reviewId', controller.checkReview);

  router
    .route('/')
    .get(authorize(false), controller.list);

  router
    .route('/:reviewId')
    .get(authorize(false), controller.get)
    .put(authorize(), isAuthor, validate(reviewValidator.update), controller.update)
    .delete(authorize(), isAuthor, controller.delete);

  router
    .route('/:reviewId/likes')
    .post(authorize(), controller.likes.add);

  router
    .route('/:reviewId/comments')
    .get(controller.comments.list)
    .post(authorize(), validate(commentValidator.create), controller.comments.create);
};
