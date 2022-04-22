'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .alterTable('movies', (table) => {
      table.text('slogan').alter();
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .alterTable('movies', (table) => {
      table.string('slogan').alter();
    });
};
