'use strict';

const asyncHandler = require('express-async-handler');
const { Http } = require('../../constants');
const service = require('./common.service');

module.exports.configuration = asyncHandler(async (req, res) => {
  const result = await service.configuration();
  return res.status(Http.OK).json(result);
});
