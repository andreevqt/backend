'use strict';

const repository = require('./review.repository');

module.exports.create = (movieId, attrs) => {
  return repository.create(movieId, attrs);
};

module.exports.update = (id, attrs) => {
  return repository.update(id, attrs);
};

module.exports.get = (id) => {
  return repository.get(id);
};

module.exports.listByMovie = (movieId, page, perPage) => {
  return repository.getByMovieId(movieId, page, perPage);
}

module.exports.list = (page, perPage) => {
  return repository.list(page, perPage);
};

module.exports.drop = (id) => {
  return repository.drop(id);
};
