'use strict';

const logger = require('../../logger');
const rejectIfTimeout = require('../reject-if-timeout');

class Visitor {
  constructor({ name, baseURL, manager, page }) {
    this._name = name;
    this._baseURL = baseURL;
    this.manager = manager;
    this._page = page;
    this.currentPage = 1;
    this.totalPages = 0;
  }

  async getLinks() {
    throw Error('Should implement this');
  }

  async getLastPage() {
    throw Error('Should implement this');
  }

  async goto(url) {
    await rejectIfTimeout(this._page.goto(url, { waitUntil: 'domcontentloaded' }));
    await this.manager.captcha.handle(page)
  }

  async visit() {
    logger.info(`${this.name} scraping data...`);
    await this.goto(this._baseURL);

    // handle captcha
    await manager.captcha.handle(page);

    // extract lastPage
    const lastPage = await this.getLastPage();
    logger.info(`Total pages - ${lastPage}`);

    // iterate over all pages
    for (; this.currentPage <= lastPage; this.currentPage++) {
      logger.info(`Scraping page ${this.currentPage}`);
      await timeout();
      await rejectIfTimeout(page.goto(`https://kinopoisk.ru/lists/movies/?page=${this.currentPage}`, { waitUntil: 'domcontentloaded' }));
      const links = await this.getLinks();

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
  }
}

module.exports = Visitor;
