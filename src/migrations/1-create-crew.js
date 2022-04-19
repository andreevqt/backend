'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('crew', (table) => {
      table.integer('personId').unsigned();
      table.integer('movieId').unsigned();
      table.string('name',);
      table.string('photo');
      table.string('originalName');
      table.string('kinopoiskLink');
      table.text('role');
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('crew');
};
