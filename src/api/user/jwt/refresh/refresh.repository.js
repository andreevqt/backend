'use strict';

const RefreshToken = require('./refresh.model');

module.exports.create = (email, token) => {
  return RefreshToken.query().insert({ email, token });
};

module.exports.getByToken = (token) => {
  return RefreshToken.query().where({ token }).first();
};

module.exports.drop = (email, token) => {
  return RefreshToken.query().where({ token, email }).skipUndefined().del();
};
