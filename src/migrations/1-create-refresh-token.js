'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('refresh_tokens', (table) => {
      table.increments('id');
      table.text('token');
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('refresh_tokens');
};
