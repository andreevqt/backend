'use strict';

const chalk = require('chalk');
const ScrapperManager = require('../core/scrapper/scrape-manager');

module.exports = async () => {
  const scrapper = new ScrapperManager();
  try {
    await scrapper.init();
    await scrapper.run();
  } catch (err) {
    console.log(chalk.red(err));
  } finally {
    await scrapper.destroy();
  }
};
