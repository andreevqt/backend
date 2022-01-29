'use strict';

const express = require('express');
const { once } = require('events');
const cors = require('cors');
const { Http } = require('../constants');
const config = require('../config');
const api = require('../api');
const bootstrap = require('../core/bootstrap');
const { errorHandler, logRequests } = require('../core/middleware');

module.exports = async (port = config.get('app.port')) => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({
    extended: false
  }));

  app.use(cors());
  app.use(logRequests);

  app.use(config.get('app.prefix'), api);

  app.use((req, res) => res.status(Http.NOT_FOUND).send(`Not found`));
  app.use(errorHandler);

  await bootstrap();

  return once(app.listen(port), `listening`)
    .then(() => console.log(`Listening on port ${port}`))
    .catch((err) => console.log(err));
};
