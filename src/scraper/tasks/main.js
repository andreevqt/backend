'use strict';

const movieTask = require('./movies');
const crewTask = require('./crew');
const personTask = require('./person');
const logger = require('../../logger');
const timeout = require('../timeout');

const extractLinks = async (page) => {
  return page.$$eval('a[href]', (links) => links
    .filter((el) => el.getAttribute('href').match(/^\/film\/\d+\/$/))
    .map((el) => el.href));
};

const getLastPage = async (page) => {
  return page.$eval('.styles_smaller__SzWsn', (el) => +el.textContent);
};

const getMovieId = (url) => {
  const match = url.match(/^.+\/(\d+)\/$/);
  return match && match[1];
};

const main = (manager) => async ({ page, data }) => {
  logger.info('Scrapping data...');
  await timeout();
  await page.goto('https://kinopoisk.ru/lists/movies', { waitUntil: 'domcontentloaded' });

  // handle captcha
  await manager.captcha.handle(page);

  // extract lastPage
  const lastPage = await getLastPage(page);
  logger.info(`Total pages - ${lastPage}`);

  // iterate over all pages
  for (; manager.page <= lastPage; manager.page++) {
    logger.info(`Scraping page ${manager.page}`);
    await timeout();
    await page.goto(`https://kinopoisk.ru/lists/movies/?page=${manager.page}`, { waitUntil: 'domcontentloaded' });
    await manager.captcha.handle(page);
    const links = await extractLinks(page);

    const tasks = [];
    for (let j = 0; j < links.length; j++) {
      // execute movie job
      const link = links[j];
      tasks.push(manager.cluster.execute(link, movieTask(manager)));

      // execute crew job
      const crewLink = `https://kinopoisk.ru/film/${getMovieId(link)}/cast/who_is/actor`;
      tasks.push(manager.cluster.execute(crewLink, crewTask(manager)));
    }

    // wait for first tasks
    await Promise.all(tasks);
  };
};

module.exports = main;
