'use strict';

const asyncHandler = require('express-async-handler');
const service = require('./genre.service');
const { Http } = require('../../constants');
const { validateId } = require('../../utils');

module.exports = {
  checkGenre: asyncHandler(async (req, res, next, id) => {
    if (!validateId(id)) {
      return res.status(Http.BAD_REQUEST).json({ success: false, message: 'Id should be a number' });
    }

    const genre = await service.get(id);
    if (!genre) {
      return res.status(Http.NOT_FOUND).json({ success: false, message: 'Genre not found' });
    }

    res.locals.genre = genre;
    next();
  }),

  list: asyncHandler(async (req, res) => {
    const { page } = req.body;

    const result = await service.list(page);
    res.status(Http.OK).json(result);
  }),

  get: asyncHandler(async (req, res) => {
    const { genre } = res.locals;
    res.status(Http.OK).json({ success: true, genre });
  })
};
