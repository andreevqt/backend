'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('movies_countries', (table) => {
      table.integer('movieId').unsigned();
      table.integer('countryId').unsigned();
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('movies_countries');
};
