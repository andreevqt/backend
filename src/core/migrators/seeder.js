'use strict';

const Base = require('./migrator-base');
const path = require('path');

class Seeder extends Base {
  constructor() {
    super();
    this.setDir(path.resolve(__dirname, '../../seeders'));
  }

  async seed(count) {
    return this.knex.withUserParams({ count }).seed.run({ directory: this.dir });
  }
}

module.exports = Seeder;
