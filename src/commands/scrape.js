'use strict';

const chalk = require('chalk');
const ClusterManager = require('../scraper/cluster-manager');

module.exports = async () => {
  const clusterManager = new ClusterManager();
  try {
    await clusterManager.init();
    await clusterManager.run();
  } catch (err) {
    console.log(chalk.red(err));
  }
};
