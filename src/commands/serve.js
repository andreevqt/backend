'use strict';

const express = require('express');
const { once } = require('events');
const { Http } = require('../constants');
const config = require('../config');
const api = require('../api');
const connectDB = require('../core/database');

module.exports = async (port = config.get('port')) => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({
    extended: false
  }));

  app.use('/api', api);

  app.use((req, res) => res.status(Http.NOT_FOUND).send(`Not found`));
  app.use((err, req, res, next) => res.status(Http.INTERNAL_SERVER_ERROR).send(`Internal Server Error`));

  await connectDB();

  return once(app.listen(port), `listening`)
    .then(() => console.log(`Serving on port ${port}`))
    .catch((err) => console.log(err.msg));
};
