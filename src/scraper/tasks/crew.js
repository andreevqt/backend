'use strict';

const logger = require('../../logger');
const { extractor, Commands } = require('../extractor');
const timeout = require('../timeout');
const CrewTable = require('../tables/crew-table');

const crewTask = (manager) => async ({ page, data: link }) => {
  logger.info(`Processing crew ${link}`);
  await timeout();
  await page.goto(link);
  await manager.captcha.handle(page);
  const rows = await page.evaluate(extractor, Commands.EXTRACT_CREW);

  const crewTable = new CrewTable(manager.knex);
  await crewTable.upsert(rows)
};

module.exports = crewTask;
