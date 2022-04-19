'use strict';

const chalk = require('chalk');
const playwright = require('@playwright/test');

const defaultConfig = {
  headless: false,
  args: ['--disable-setuid-sandbox'],
  ignoreHTTPSErrors: true
};

const start = async (config) => {
  let browser;
  try {
    console.log(chalk.green('Opening the browser...'));
    browser = await playwright.firefox.launch({ ...defaultConfig, ...config });
  } catch (err) {
    console.log(chalk.red('Could not create a browser instance'), err);
    throw err;
  }
  return browser;
};

module.exports = {
  start
};
