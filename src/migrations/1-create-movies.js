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
      table.text('slogan');
      table.string('poster');
      table.text('description');
      table.string('budget');
      table.string('feesWorld');
      table.string('feesUSA');
      table.string('feesRussia')
      table.string('age');
      table.integer('duration');
      table.datetime('release');
      table.datetime('lastSync');
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('movies');
};
