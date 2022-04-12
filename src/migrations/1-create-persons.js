'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('persons', (table) => {
      table.increments('id');
      table.string('name');
      table.string('photo');
      table.string('originalName');
      table.string('birthDate');
      table.string('placeOfBirth');
      table.datetime('lastSync');
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('persons');
};
