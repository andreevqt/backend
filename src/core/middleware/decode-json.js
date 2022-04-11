'use strict';

const _ = require('lodash');
const { Http } = require('../../constants');

const decodeJSON = (path) => (req, res, next) => {
  try {
    const data = _.get(req, path);
    _.set(req, path, JSON.parse(data));
  } catch (err) {
    return res.status(Http.BAD_REQUEST).json({
      success: false,
      message: 'Bad JSON format'
    });
  }

  next();
};

module.exports = decodeJSON;
