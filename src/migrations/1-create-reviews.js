'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('reviews', (table) => {
      table.increments('id');
      table.string('title', 1024);
      table.text('content');
      table.integer('movieId').unsigned();
      table.json('movie');
      table.integer('authorId').unsigned();
      table.tinyint('rating').defaultTo(10);
      table.timestamps(false, true);
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('reviews');
};
