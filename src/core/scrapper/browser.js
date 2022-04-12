'use strict';

const chalk = require('chalk');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const defaultConfig = {
  headless: false,
  args: ['--disable-setuid-sandbox'],
  ignoreHTTPSErrors: true
};

const start = async (config) => {
  let browser;
  try {
    console.log(chalk.green('Opening the browser...'));
    browser = await puppeteer.launch({ ...defaultConfig, ...config });
  } catch (err) {
    console.log(chalk.red('Could not create a browser instance'), err);
    throw err;
  }
  return browser;
};

module.exports = {
  start
};
