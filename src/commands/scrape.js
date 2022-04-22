'use strict';

const chalk = require('chalk');
const cluster = require('../scraper/cluster');

module.exports = async () => {
  try {
    await cluster.run();
  } catch (err) {
    console.log(chalk.red(err));
  }
};
