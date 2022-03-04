'use strict';

const User = require('./user.model');

module.exports.get = (id) => {
  return User.query().modify('default').findById(id);
};

module.exports.getByEmail = (email) => {
  return User.query().modify('default').where({ email }).first();
};

module.exports.list = (page, perPage) => {
  return User.query().modify('default').page(page, perPage);
};

module.exports.create = async ({ avatar, ...rest }) => {
  const user = await User.query().insert(rest);
  if (avatar) {
    await user.$relatedQuery('image').insert(avatar);
  }

  return user.$query().modify('default');
};

module.exports.update = (id, attrs) => {
  return User.query().patchAndFetchById(id, attrs);
}
