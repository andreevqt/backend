'use strict';

const repository = require('./review.repository');

module.exports.create = (movie, attrs) => {
  return repository.create(movie, attrs);
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

module.exports.delete = (id) => {
  return repository.delete(id);
};

module.exports.comments = {
  list: (id, page, perPage) => {
    return repository.comments.list(id, page, perPage);
  },

  create: (id, attrs) => {
    return repository.comments.create(id, attrs);
  }
};
