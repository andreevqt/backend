'use strict';

const { Http } = require('../../constants');
const jwt = require('./jwt/jwt.service');
const service = require('./user.service');
const asyncHandler = require('express-async-handler');

module.exports.authorize = asyncHandler(async (req, res, next) => {
  const header = req.headers['authorization'] || '';
  const authorization = header.split(' ')[1];
  if (!authorization) {
    res.status(Http.UNAUTHROIZED).json({ success: false, message: 'Not authorzied' });
    return;
  }

  try {
    const { id } = jwt.verify(authorization);
    const user = await service.get(id);
    if (!user) {
      return res.status(Http.UNAUTHROIZED).json({ success: false, message: 'Not authorzied' });
    }

    res.locals.currentUser = user;
    next();
  } catch (err) {
    return res.status(Http.FORBIDDEN).json({ success: false, message: 'Forbidden' });
  }
});

module.exports.isCurrentUser = (req, res, next) => {
  const { user, currentUser } = res.locals;
  if (currentUser.id !== user.id) {
    return res.status(Http.FORBIDDEN).json({ success: false, message: 'Forbidden' });
  }

  next();
};
