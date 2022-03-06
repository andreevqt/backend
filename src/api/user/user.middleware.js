'use strict';

const { Http } = require('../../constants');
const jwt = require('./jwt/jwt.service');
const service = require('./user.service');
const asyncHandler = require('express-async-handler');

module.exports.authorize = (abortIfNotFound = true) => asyncHandler(async (req, res, next) => {
  const header = req.headers['authorization'] || '';
  const authorization = header.replace('Bearer ', '');
  if (!authorization) {
    return abortIfNotFound
      ? res.status(Http.UNAUTHROIZED).json({ success: false, message: 'Not authorzied' })
      : next();
  }

  try {
    const { id } = jwt.verify(authorization);
    const user = await service.get(id);
    if (!user) {
      return abortIfNotFound
        ? res.status(Http.UNAUTHROIZED).json({ success: false, message: 'Not authorzied' })
        : next();
    }

    res.locals.currentUser = user;
    next();
  } catch (err) {
    return abortIfNotFound
      ? res.status(Http.FORBIDDEN).json({ success: false, message: 'Forbidden' })
      : next();
  }
});

module.exports.isCurrentUser = (req, res, next) => {
  const { user, currentUser } = res.locals;
  if (currentUser.id !== user.id) {
    return res.status(Http.FORBIDDEN).json({ success: false, message: 'Forbidden' });
  }

  next();
};
