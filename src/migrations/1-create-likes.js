'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('likes', (table) => {
      table.increments('id');
      table.string('likeableType');
      table.integer('likeableId').unsigned();
      table.integer('authorId').unsigned();
      table.timestamps(false, true);
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('likes');
};
