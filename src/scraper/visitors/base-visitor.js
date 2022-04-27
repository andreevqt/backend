'use strict';

const logger = require('../../logger');

class Visitor {
  constructor(name, baseURL, task) {
    this._name = name;
    this._baseURL = baseURL;
    this._task = task;
    this._currentPage = 1;
    this._totalPages = 1;
  }

  getState() {
    return {
      currentPage: this._currentPage,
      totalPages: this._totalPages
    };
  }

  setState(state) {
    if (!state) {
      return;
    }

    const { currentPage, totalPages } = state;

    this._currentPage = currentPage;
    this._totalPages = totalPages;
  }

  async getLinks() {
    throw Error('Should implement this');
  }

  async getLastPage() {
    throw Error('Should implement this');
  }

  async goto(url) {
    return this._task.goto(url);
  }

  async visit(processLink = new Promise) {
    logger.info(`${this._name} scraping data...`);
    await this.goto(this._baseURL);

    // extract lastPage
    this._totalPages = await this.getLastPage();
    logger.info(`Total pages - ${this._totalPages}`);

    // iterate over all pages
    for (; this._currentPage <= this._totalPages; this._currentPage++) {
      logger.info(`Scraping page ${this._currentPage}`);
      await this.goto(`${this._baseURL}?page=${this._currentPage}`);
      const links = await this.getLinks();

      const tasks = [];
      for (let j = 0; j < links.length; j++) {
        // execute movie job
        const link = links[j];
        tasks.push(processLink(link));
      }

      // wait for first tasks
      await Promise.all(tasks);
    };

    logger.info(`${this._name} done!!!`);
  }
}

module.exports = Visitor;
