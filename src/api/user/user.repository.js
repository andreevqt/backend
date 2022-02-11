'use strict';

const User = require('./user.model');

module.exports.get = (id) => {
  return User.query().withGraphFetched('image').findById(id);
};

module.exports.getByEmail = (email) => {
  return User.query().withGraphFetched('image').where({ email }).first();
}

module.exports.list = (page, perPage) => {
  return User.query().withGraphFetched('image').page(page, perPage);
};

module.exports.create = async ({ avatar, ...rest }) => {
  const user = await User.query().withGraphFetched('image').insert(rest);
  if (avatar) {
    await user.$relatedQuery('image').insert(avatar);
  }

  return user.$query().withGraphFetched('image');
};

module.exports.update = (id, attrs) => {
  return User.query().withGraphFetched('image').patchAndFetchById(id, attrs);
}
