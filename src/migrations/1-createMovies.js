'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('movies', (table) => {
      table.increments('id');
      table.string('title');
      table.text('description');
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('movies');
};
