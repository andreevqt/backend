'use strict';

const repository = require('./setttings.repository');

module.exports.get = (key) => {
  return repository.get(key);
};

module.exports.create = (key, value) => {
  return repository.create(key, value);
};

module.exports.update = (key, value) => {
  return repository.update(key, value);
};
