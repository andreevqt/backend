'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('images', (table) => {
      table.increments('id');
      table.string('name');
      table.string('path');
      table.string('ext');
      table.string('mimetype');
      table.integer('size');
      table.integer('width');
      table.integer('height');
      table.string('url');
      table.json('formats');
      table.string('imageableType');
      table.integer('imageableId').unsigned();
      table.timestamps(false, true);
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('images');
};
