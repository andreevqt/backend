'use strict';

const repository = require('./genre.repository');

module.exports.list = () => {
  return repository.list();
};

module.exports.get = (id) => {
  return repository.get(id);
};
