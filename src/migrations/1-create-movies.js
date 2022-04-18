'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('movies', (table) => {
      table.increments('id');
      table.string('title');
      table.string('originalTitle');
      table.decimal('rating');
      table.integer('votes');
      table.string('type');
      table.integer('year');
      table.string('slogan');
      table.string('poster');
      table.text('description');
      table.string('budget');
      table.string('feesWorld');
      table.string('feesUSA');
      table.string('feesRussia')
      table.string('age');
      table.string('duration');
      table.datetime('lastSync');
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('movies');
};
