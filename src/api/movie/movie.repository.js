'use strict';

const Movie = require('./movie.model');

module.exports.list = (page, perPage) => {
  return Movie.query().page(page, perPage);
};
