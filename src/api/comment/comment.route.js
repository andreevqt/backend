'ust strict';

const { Router } = require('express');
const controller = require('./comment.controller');
const { authorize } = require('../user/user.middleware');
const { isCommentsAuthor } = require('./comment.middleware');
const validator = require('./comment.validator');
const { validate } = require('../../core/middleware');

const router = new Router();

module.exports = (app) => {
  app.use('/comments', router);

  router.param('commentId', controller.checkComment);

  router
    .route('/')
    .get(controller.list);

  router
    .route('/:commentId')
    .get(controller.get)
    .put(authorize, isCommentsAuthor, validate(validator.update), controller.update)
    .delete(authorize, isCommentsAuthor, controller.delete);
};
