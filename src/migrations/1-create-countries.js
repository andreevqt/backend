'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('countries', (table) => {
      table.increments('id');
      table.string('name');
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('countries');
};
