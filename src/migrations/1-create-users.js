'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id');
      table.string('name');
      table.string('_password');
      table.string('vk');
      table.string('facebook');
      table.string('telegram');
      table.string('email').unique();
      table.timestamps(false, true);
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('users');
};
