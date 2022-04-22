'use strict';

const BaseTable = require('./base-table');

class CrewTable extends BaseTable {
  async upsert(crew) {
    if (!crew || Array.isArray(crew) && !crew.length) {
      return;
    }
    return this._knex('crew')
      .insert(crew)
      .onConflict(['personId', 'movieId'])
      .merge();
  }
}

module.exports = CrewTable;

