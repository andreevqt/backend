'use strict';

const chalk = require('chalk');
const ProxyRotator = require('../proxy-rotator/proxy-rotator');

module.exports = async () => {
  const rotator = new ProxyRotator;
  try {
    await rotator.run();
  } catch (err) {
    console.log(chalk.red(err));
  } finally {
    await rotator.destroy();
  }
};
