'use strict';

const asyncHandler = require('express-async-handler');
const service = require('./comment.service');
const { Http } = require('../../constants');

module.exports.checkComment = asyncHandler(async (req, res, next, id) => {
  if (!/^[0-9]+$/.test(id)) {
    return res.status(Http.BAD_REQUEST).json({ success: false, message: 'Id should be a number' });
  }

  const comment = await service.get(id);
  if (!comment) {
    return res.status(Http.NOT_FOUND).json({ success: false, message: 'Comment not found' });
  }

  res.locals.comment = comment;
  next();
});

module.exports.list = asyncHandler(async (req, res) => {
  const { page, perPage } = req.query;
  const results = await service.list(page, perPage);
  res.status(Http.OK).json(results)
});

module.exports.get = asyncHandler(async (req, res) => {
  const { comment } = res.locals;
  res.status(Http.OK).json({ success: true, comment });
});

module.exports.update = asyncHandler(async (req, res) => {
  const attrs = req.body;
  const { comment } = res.locals;
  const updated = await service.update(comment.id, attrs);
  res.status(Http.OK).json({ success: true, comment: updated });
});

module.exports.delete = asyncHandler(async (req, res) => {
  const { comment } = res.locals;
  await service.delete(comment.id);
  res.status(Http.OK).json({ success: true, message: 'Comment is deleted' });
});
