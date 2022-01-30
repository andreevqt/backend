'use strict';

const User = require('./user.model');

module.exports.get = (id) => {
  return User.query().findById(id);
};

module.exports.getByEmail = (email) => {
  return User.query().where({ email }).first();
}

module.exports.list = (page, perPage) => {
  return User.query().page(page, perPage);
};

module.exports.create = (attrs) => {
  return User.query().insert(attrs);
};

module.exports.update = (id, attrs) => {
  return User.query().patchAndFetchById(id, attrs);
}

