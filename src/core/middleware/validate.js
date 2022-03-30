'use strict';

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

module.exports = (schema, where = 'body') => async (req, res, next) => {
  try {
    req[where] = await schema.validate(req[where], { abortEarly: false });
    next();
  } catch (err) {
    const errors = getYupErrors(err);
    res.status(Http.BAD_REQUEST).json({ success: false, errors });
  }
};
