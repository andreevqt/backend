'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('movies_genres', (table) => {
      table.integer('movieId').unsigned();
      table.integer('genreId').unsigned();
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('movies_genres');
};
