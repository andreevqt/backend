'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('settings', (table) => {
      table.increments('id');
      table.string('key').unique();
      table.json('value');
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('settings');
};
