'use strict';

const logger = require('../../logger');
const { extractor, Commands } = require('../extractor');
const MovieTable = require('../tables/movie-table');
const timeout = require('../timeout');
const rejectIfTimeout = require('../reject-if-timeout');

const movieTask = (manager) => async ({ page, data: link }) => {
  const movieTable = new MovieTable(manager.knex);
  logger.info(`Processing movie ${link}`);

  await timeout();
  await rejectIfTimeout(page.goto(link, { waitUntil: 'domcontentloaded' }));
  await manager.captcha.handle(page);

  const { movie, countries, genres } = await page.evaluate(extractor, Commands.EXTRACT_MOVIE);
  await movieTable.upsert(movie, countries, genres);
};

module.exports = movieTask;
