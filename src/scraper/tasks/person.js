'use strict';

const logger = require('../../logger');
const { Commands, extractor } = require('../extractor');
const PersonTable = require('../tables/person-table');
const timeout = require('../timeout');

const personTask = (manager) => async ({ page, data: link }) => {
  logger.info(`Processing person ${link}`);
  const personTable = new PersonTable(manager.knex);
  await timeout();
  await page.goto(link, { waitUntil: 'domcontentloaded' });
  await manager.captcha.handle(page);
  const person = await page.evaluate(extractor, Commands.EXTRACT_PERSON);
  await personTable.upsert(person);
};

module.exports = personTask;
