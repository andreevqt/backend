'use strict';

const BaseTable = require('./base-table');

class PersonTable extends BaseTable {
  async upsert(attrs) {
    return this._knex('persons')
      .insert({ ...attrs, lastSync: this._knex.raw('now()') })
      .onConflict('id')
      .merge();
  };
}

module.exports = PersonTable;
