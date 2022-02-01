'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('refresh_tokens', (table) => {
      table.increments('id');
      table.string('email');
      table.text('token');
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('refresh_tokens');
};
