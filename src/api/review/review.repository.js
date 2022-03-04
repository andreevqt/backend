'use stirct';

const Review = require('./review.model');

module.exports.list = (page, perPage) => {
  return Review.query().modify('default').page(page, perPage);
};

module.exports.get = (id) => {
  return Review.query().modify('default').findById(id);
};

module.exports.getByMovieId = (movieId, page, perPage) => {
  return Review.query().modify('default').where({ movieId }).page(page, perPage);
}

module.exports.create = (movieId, attrs) => {
  return Review.query().insert({ movieId, ...attrs });
};

module.exports.update = (id, attrs) => {
  return Review.query().patchAndFetchById(id, attrs);
};

module.exports.delete = (id) => {
  return Review.query().findById(id).del();
};

module.exports.comments = {
  list: (id, page, perPage) => {
    return Review.relatedQuery('comments').withGraphFetched('author').for(id).page(page, perPage);
  },

  create: (id, attrs) => {
    return Review.relatedQuery('comments').withGraphFetched('author').for(id).insert(attrs);
  }
};
