'use strict';

const asyncHandler = require('express-async-handler');
const reviewService = require('./review.service');
const { Http } = require('../../constants');
const { validateId } = require('../../utils');

module.exports.checkReview = asyncHandler(async (req, res, next, id) => {
  if (!validateId(id)) {
    return res.status(Http.BAD_REQUEST).json({ success: false, message: 'Id should be a number' });
  }

  const review = await reviewService.get(id);
  if (!review) {
    return res.status(Http.NOT_FOUND).json({ success: false, message: 'Review not found' });
  }

  res.locals.review = review;
  next();
});

module.exports.list = asyncHandler(async (req, res) => {
  const { page, perPage } = req.query;
  const results = await reviewService.list(page, perPage);
  res.status(Http.OK).json(results);
});

module.exports.get = asyncHandler(async (req, res) => {
  const { review } = res.locals;
  res.status(Http.OK).json({ success: true, review });
});

module.exports.update = asyncHandler(async (req, res) => {
  const attrs = req.body;
  const { review } = res.locals;
  const updated = await reviewService.update(review.id, attrs);
  res.status(Http.OK).json({ success: true, review: updated });
});

module.exports.delete = asyncHandler(async (req, res) => {
  const { review } = res.locals;
  await reviewService.delete(review.id);
  res.status(Http.OK).json({ success: true, message: 'Review is deleted' });
});

module.exports.comments = {
  list: asyncHandler(async (req, res) => {
    const { review } = res.locals;
    const { page, perPage } = req.query;
    const results = await reviewService.comments.list(review.id, page, perPage);
    res.status(Http.OK).json(results)
  }),

  create: asyncHandler(async (req, res) => {
    const { review, currentUser } = res.locals;
    const attrs = { ...req.body, authorId: currentUser.id };
    const results = await reviewService.comments.create(review.id, attrs);
    res.status(Http.CREATED).json(results);
  })
};
