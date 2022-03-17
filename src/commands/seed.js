'use strict';

const chalk = require('chalk');

const { Seeder } = require('../core/migrators');

module.exports = async (count) => {
  const seeder = new Seeder();
  try {
    await seeder.init();
    await seeder.seed({ count: +count });
  } catch (err) {
    console.log(chalk.red(err.stack));
  } finally {
    await seeder.destroy();
  }
};
