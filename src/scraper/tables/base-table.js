'use strict';

class BaseTable {
  constructor(knex) {
    this._knex = knex;
  }
}

module.exports = BaseTable;
