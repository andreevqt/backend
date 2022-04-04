'use strict';

const { Http } = require('../../constants');
const service = require('./user.service');
const asyncHandler = require('express-async-handler');
const { validateId } = require('../../utils');

module.exports = {
  checkUser: asyncHandler(async (req, res, next, id) => {
    if (!validateId(id)) {
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
    res.status(Http.OK).json({ success: true, user });
  }),

  list: asyncHandler(async (req, res) => {
    const { page, perPage } = req.query;

    const result = await service.list(page, perPage);
    res.status(Http.OK).json(result);
  }),

  create: asyncHandler(async (req, res, next) => {
    const attrs = req.body;
    const avatar = req.file;

    try {
      const user = await service.create({ avatar, ...attrs });
      res.status(Http.CREATED).json({ success: true, user });
    } catch (err) {
      service.checkDuplicateEmail(err, req, res, next);
    }
  }),

  update: asyncHandler(async (req, res) => {
    const { user } = res.locals;
    const attrs = req.body;

    const updated = await service.update(user.id, attrs);
    res.status(Http.OK).json({ success: true, user: updated });
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

  getByAccess: asyncHandler(async (req, res) => {
    const { currentUser } = res.locals;
    return res.status(Http.OK).json({ success: true, user: currentUser });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await service.login(email, password);
    if (!user) {
      return res.status(Http.FORBIDDEN).json({ success: false, message: 'Wrong credentials' });
    }

    res.status(Http.OK).json({ success: true, user });
  }),

  logout: asyncHandler(async (req, res) => {
    const { token } = req.body;

    const result = await service.logout(token);
    if (!result) {
      return res.status(Http.BAD_REQUEST).send({ success: false, message: 'Wrong token' })
    };

    res.status(Http.OK).send({ success: true, message: 'Logout is successful' });
  }),

  likes: asyncHandler(async (req, res) => {
    const { page, perPage } = req.query;
    const { user } = res.locals;
    const result = await service.likes(user.id, page, perPage);
    
    res.status(Http.OK).send(result);
  }),

  reviews: asyncHandler(async (req, res) => {

  })
};
