'use strict';

const asyncHandler = require('express-async-handler');
const service = require('./genre.service');
const { Http } = require('../../constants');

module.exports = {
  list: asyncHandler(async (req, res) => {
    const { page } = req.body;

    const result = await service.list(page);
    res.status(Http.OK).json(result);
  })
};
