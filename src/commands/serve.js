'use strict';

const express = require('express');
const { once } = require('events');
const chalk = require('chalk');
const config = require('../config');
const bootstrap = require('../core/bootstrap');

module.exports = async (port = config.get('app.port')) => {
  const app = express();
  await bootstrap(app);

  return once(app.listen(port), 'listening')
    .then(() => console.log(chalk.blue(`Listening on port ${port}`)))
    .catch((err) => console.log(chalk.red(err)));
};
