'use strict';

const Base = require('./migrator-base');
const path = require('path');

class Seeder extends Base {
  constructor() {
    super();
    this.setDir(path.resolve(__dirname, '../../seeders'));
  }

  async seed(params = {}) {
    return this.knex.withUserParams(params).seed.run({ directory: this.dir });
  }
}

module.exports = Seeder;
