'use strict';

const RefreshToken = require('./refresh.model');

module.exports.create = (token) => {
  return RefreshToken.query().insert({ token });
};

module.exports.getByToken = (token) => {
  return RefreshToken.query().where({ token }).first();
};

module.exports.drop = (token) => {
  return RefreshToken.query().where({ token }).del();
};
