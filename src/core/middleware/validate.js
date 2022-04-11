'use strict';

const asyncHandler = require('express-async-handler');
const _ = require('lodash');
const { Http } = require('../../constants');

const getYupErrors = (err) => {
  const errors = {};

  err.inner.forEach((error) => {
    if (error.path) {
      errors[error.path] = error.message;
    }
  });

  return errors;
};

module.exports = (schema, where = 'body') => asyncHandler(async (req, res, next) => {
  try {
    const payload = _.get(req, where);
    const casted = await schema.validate(payload, { abortEarly: false });
    _.set(req, where, casted);
    next();
  } catch (err) {
    const errors = getYupErrors(err);
    res.status(Http.BAD_REQUEST).json({ success: false, errors });
  }
});
