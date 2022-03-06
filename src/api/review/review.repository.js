'use stirct';

const Review = require('./review.model');

module.exports.list = (currentUserId, page, perPage) => {
  return Review.query().modify('defaultSelect', currentUserId).page(page, perPage);
};

module.exports.get = (id, currentUserId) => {
  return Review.query().modify('defaultSelect', currentUserId).findById(id);
};

module.exports.getByMovieId = (movieId, currentUserId, page, perPage) => {
  return Review.query().modify('defaultSelect', currentUserId).where({ movieId }).page(page, perPage);
}

module.exports.create = (movie, attrs) => {
  return Review.query().insert({ movieId: movie.id, movie, ...attrs });
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
