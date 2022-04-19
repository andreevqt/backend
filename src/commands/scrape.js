'use strict';

const chalk = require('chalk');
const ScrapeManager = require('../core/scraper/scrape-manager');
const config = require('../config');

module.exports = async () => {
  const scrapper = new ScrapeManager({
    headless: config.get('scraper.headless'),
  }, config.get('scraper.queueCapacity'));

  try {
    await scrapper.init();
    await scrapper.run();
  } catch (err) {
    console.log(chalk.red(err));
  } finally {
    await scrapper.destroy();
  }
};
