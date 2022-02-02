'use stirct';

const Review = require('./review.model');

module.exports.list = (page, perPage) => {
  return Review.query().withGraphFetched('author').page(page, perPage);
};

module.exports.get = (id) => {
  return Review.query().withGraphFetched('author').findById(id);
};

module.exports.getByMovieId = (movieId, page, perPage) => {
  return Review.query().withGraphFetched('author').where({ movieId }).page(page, perPage);
}

module.exports.create = (movieId, attrs) => {
  return Review.query().withGraphFetched('author').insert({ movieId, ...attrs });
};

module.exports.update = (id, attrs) => {
  return Review.query().withGraphFetched('author').patchAndFetchById(id, attrs);
};

module.exports.drop = (id) => {
  return Review.query().findById(id).del();
};
