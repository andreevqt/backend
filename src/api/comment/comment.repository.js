'use strict';

const Comment = require('./comment.model');

module.exports.list = (page, perPage) => {
  return Comment.query().withGraphFetched('author').page(page, perPage);
};

module.exports.get = (id) => {
  return Comment.query().withGraphFetched('author').findById(id);
};

module.exports.update = (id, attrs) => {
  return Comment.query().withGraphFetched('author').patchAndFetchById(id, attrs);
}

module.exports.delete = (id) => {
  return Comment.query().findById(id).del();
};
