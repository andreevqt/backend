'use strict';

const { shuffle, randomInt } = require('../utils');

module.exports.seed = async (knex) => {
  // clear table
  await knex('users').truncate();
  await knex('users').insert({
    name: 'John Doe',
    password: '12345',
    email: 'john@yahoo.com'
  });

  await knex('users').insert({
    name: 'Jane Doe',
    password: '12345',
    email: 'jane@yahoo.com'
  });
};
