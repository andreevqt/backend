'use strict';

const createKnex = require('knex');
const config = require('../config');

module.exports = async () => {
  let knex;

  if (process.env.NODE_ENV === 'test') {
    knex = createKnex({
      client: 'sqlite3',
      connection: {
        filename: ':memory:'
      },
      debug: config.get('debug'),
      useNullAsDefault: true
    });
  } else {
    knex = createKnex({
      debug: config.get('debug'),
      client: config.get('db.client'),
      connection: {
        host: config.get('db.host'),
        user: config.get('db.user'),
        password: config.get('db.password'),
        database: config.get('db.database')
      }
    });
  }

  await knex.raw('select 1+1 as result');

  return knex;
};
