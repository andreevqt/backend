'use strict';

module.exports.up = (knex) => {
  return knex.schema
    .createTable('comments', (table) => {
      table.increments('id');
      table.text('content');
      table.string('commentableType');
      table.integer('commentableId').unsigned();
      table.integer('authorId').unsigned();
      table.timestamps(false, true);
    });
};

module.exports.down = (knex) => {
  return knex.schema
    .dropTable('comments');
};
