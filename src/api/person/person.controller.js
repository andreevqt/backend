'use strict';

const asyncHandler = require('express-async-handler');
const { Http } = require('../../constants');
const service = require('./person.service')

module.exports = {
  get: asyncHandler(async (req, res) => {
    const { personId } = req.params;

    const result = await service.get(personId);
    return res.status(Http.OK).json(result);
  }),

  popular: asyncHandler(async (req, res) => {
    const { page } = req.query;

    const result = await service.popular(page);
    return res.status(Http.OK).json(result);
  }),

  credits: asyncHandler(async (req, res) => {
    const { personId } = req.params;

    const result = await service.credits(personId);
    return res.status(Http.OK).json(result);
  })
};
