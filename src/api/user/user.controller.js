'use strict';

const { Http } = require('../../constants');
const service = require('./user.service');
const asyncHandler = require('express-async-handler');

module.exports = {
  checkUser: asyncHandler(async (req, res, next, id) => {
    if (!/^[0-9]+$/.test(id)) {
      return res.status(Http.BAD_REQUEST).json({ success: false, message: 'Id should be a number' });
    }

    const user = await service.get(id);
    if (!user) {
      return res.status(Http.NOT_FOUND).json({ success: false, message: 'User not found' });
    }

    res.locals.user = user;
    next();
  }),

  get: asyncHandler(async (req, res) => {
    const { user } = res.locals;
    return res.status(Http.OK).json({ success: true, user });
  }),

  list: asyncHandler(async (req, res) => {
    const { page, perPage } = req.query;

    const result = await service.list(page, perPage);
    return res.status(Http.OK).json(result);
  }),

  create: asyncHandler(async (req, res, next) => {
    const attrs = req.body;

    try {
      const user = await service.create(attrs);
      res.status(Http.CREATED).json({ success: true, user });
    } catch (err) {
      service.checkDuplicateEmail(err, req, res, next);
    }
  }),

  token: asyncHandler(async (req, res) => {
    const { token } = req.body;

    try {
      const tokens = await service.refresh(token);
      if (!tokens) {
        return res.status(Http.UNAUTHROIZED).json({ success: false, message: 'User not found' });
      }
      res.status(Http.OK).json({ success: true, tokens });
    } catch (err) {
      res.status(Http.FORBIDDEN).json({ success: false, message: 'Forbidden' });
    }
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await service.login(email, password);
    if (!user) {
      return res.status(Http.FORBIDDEN).json({ success: false, message: 'Wrong credentials' });
    }

    res.status(Http.OK).json({ success: true, user });
  })
};
