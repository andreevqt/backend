'use strict';

const Base = require('./migrator-base');
const path = require('path');

class Migrator extends Base {
  constructor() {
    super();
    this.setDir(path.resolve(__dirname, '../../migrations'))
  }

  async migrate() {
    await this.knex.migrate.latest({ directory: this.dir });
  }

  async rollback() {
    await this.knex.migrate.rollback({ directory: this.dir }, true);
  }

  async refresh() {
    await this.rollback();
    await this.migrate();
  }
}

module.exports = Migrator;
