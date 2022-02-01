'use strict';

const repository = require('./like.repository');

module.exports.create = (attrs) => {
  return repository.create(attrs);
};

module.exports.get = (query) => {
  return repository.get(query);
};

module.exports.drop = (query) => {
  return repository.drop(query);
}

module.exports.hasLike = async (query) => {
  const results = await repository.get(query);
  return results.total > 0;
};
