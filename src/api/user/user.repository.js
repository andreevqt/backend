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

module.exports.create = async ({ image, ...rest }) => {
  const user = await User.query().insert(rest);
  if (image) {
    await user.$relatedQuery('image').insert(image);
  }

  return user.$query().modify('default');
};

module.exports.update = async (id, { image, ...rest }) => {
  const user = await User.query().modify('default').patchAndFetchById(id, rest);
  if (image) {
    await user.$relatedQuery('image').insert(image);
  } else if (typeof image !== undefined) {
    await user.$relatedQuery('image').delete();
  }

  return user.$query().modify('default');
};
