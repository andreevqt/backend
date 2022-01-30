'use strict';

const chalk = require('chalk');

const { Seeder } = require('../core/migrators');

module.exports = async () => {
  const seeder = new Seeder();
  try {
    await seeder.init();
    await seeder.seed();
  } catch (err) {
    console.log(chalk.red(err.message));
  } finally {
    await seeder.destroy();
  }
};
