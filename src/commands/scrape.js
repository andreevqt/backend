'use strict';

const chalk = require('chalk');
const ClusterManager = require('../scraper/cluster-manager');

module.exports = async ({ re }) => {
  const clusterManager = new ClusterManager();

  try {
    await clusterManager.init();
    if (re) {
      await clusterManager.repair();
    } else {
      await clusterManager.scrape();
    }
  } catch (err) {
    console.log(chalk.red(err));
  }
};
