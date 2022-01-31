'use strict';

const Like = require('./like.model');

module.exports.create = (attrs) => {
  return Like.query().insert(attrs);
};

module.exports.get = ({ page, perPage, ...rest }) => {
  return Like.query().where(rest).page(page, perPage).withGraphFetched('author');
};

module.exports.drop = (query) => {
  return Like.query().where(query).del();
}
