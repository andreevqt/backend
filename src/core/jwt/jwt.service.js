'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config');
const repository = require('./refresh/refresh.repository');

module.exports.getByToken = (token) => {
  return repository.getByToken(token);
};

module.exports.generateRefresh = async (data) => {
  const secret = config.get('app.secret');
  if (!secret) {
    throw new Error('App secret key is missing!');
  }

  const token = jwt.sign(data, secret);
  const entry = await repository.create(token);
  return entry.token;
};

module.exports.generateAccess = (data) => {
  const secret = config.get('app.secret');
  if (!secret) {
    throw new Error('App secret key is missing!');
  }

  const expiresIn = config.get('jwt.expiresIn');
  return jwt.sign(data, secret, { expiresIn });
};

module.exports.verify = (token) => {
  return jwt.verify(token, config.get('app.secret'));
};

module.exports.drop = (token) => {
  return repository.drop(token);
};

module.exports.generateTokens = async (data) => {
  return {
    access: this.generateAccess(data),
    refresh: await this.generateRefresh(data)
  };
};
