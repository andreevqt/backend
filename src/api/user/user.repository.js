'use strict';

const { ref } = require('objection');
const User = require('./user.model');
const Review = require('../review/review.model');

const findQuery = () => User.query().withGraphFetched('[image]').select([
  'users.*',
  Review.query()
    .where('authorId', ref('users.id'))
    .count()
    .as('reviewsCount')
]);

module.exports.get = (id) => {
  return findQuery().findById(id);
};

module.exports.getByEmail = (email) => {
  return findQuery().where({ email }).first();
}

module.exports.list = (page, perPage) => {
  return findQuery().page(page, perPage);
};

module.exports.create = async ({ avatar, ...rest }) => {
  const user = await User.query().insert(rest);
  if (avatar) {
    await user.$relatedQuery('image').insert(avatar);
  }

  return user.$query().withGraphFetched('[image]');
};

module.exports.update = (id, attrs) => {
  return User.query().patchAndFetchById(id, attrs);
}
