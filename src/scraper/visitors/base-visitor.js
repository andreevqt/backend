'use strict';

const logger = require('../../logger');
const rejectIfTimeout = require('../reject-if-timeout');

class Visitor {
  constructor({ name, baseURL, task }) {
    this._name = name;
    this._baseURL = baseURL;
    this._task = task;
    this._currentPage = 1;
    this._totalPages = 0;
  }

  getState() {
    return {
      currentPage: this._currentPage,
      totalPages: this._totalPages
    };
  }

  setState({ currentPage, totalPages }) {
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
    await timeout();
    this._task.goto(url);
    await this._task.handleCaptcha();
  }

  async visit(processLink = new Promise) {
    logger.info(`${this.name} scraping data...`);
    await this.goto(this._baseURL);

    // extract lastPage
    const lastPage = await this.getLastPage();
    logger.info(`Total pages - ${lastPage}`);

    // iterate over all pages
    for (; this._currentPage <= lastPage; this._currentPage++) {
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
  }
}

module.exports = Visitor;
