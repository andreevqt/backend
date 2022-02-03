'use strict';

const repository = require('./comment.repository');

module.exports.list = (page, perPage) => {
  return repository.list(page, perPage);
}

module.exports.get = (id) => {
  return repository.get(id);
};

module.exports.update = (id, attrs) => {
  return repository.update(id, attrs);
};

module.exports.delete = (id) => {
  return repository.delete(id);
};
