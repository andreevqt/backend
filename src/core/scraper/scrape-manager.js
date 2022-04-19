'use strict';

const chalk = require('chalk');
const browser = require('./browser');
const movieScrapper = require('./movie-scraper');
const crewScrapper = require('./crew-scraper');
const personScrapper = require('./person-scraper');
const Captcha = require('./captcha');
const initKnex = require('../database');
const globalScript = require('./global-script');
const Queue = require('./queue');
const logger = require('../../logger');

class ScrapeManager {
  constructor(browserConfig, capacity = 50) {
    this._isInitialized = false;
    this._browserConfig = browserConfig;
    this._captcha = new Captcha();
    this._baseUrl = 'https://www.kinopoisk.ru';
    this._currentPage = 1;
    this._browser = null;
    this._knex = null;
    this._moviePage = null;
    this._crewPage = null;
    this._personPage = null;
    this._filtersPage = null;
    this._personQueue = new Queue(capacity);
    this._movieQueue = new Queue(capacity);
    this._crewQueue = new Queue(capacity);
  }

  async init() {
    if (this._isInitialized) {
      return;
    }

    this._browser = await browser.start(this._browserConfig);
    this._knex = await initKnex();
    const { _currentPage } = await this._getState();
    this._currentPage = _currentPage;
    this._filtersPage = await this._newPage();
    this._moviePage = await this._newPage();
    this._crewPage = await this._newPage();
    this._personPage = await this._newPage();
    this._isInitialized = true;
  }

  async destroy() {
    if (this._browser) {
      await this._browser.close();
    }
    if (this._knex) {
      await this._knex.destroy();
    }
  }

  async _saveState() {
    const value = JSON.stringify({ _currentPage: this._currentPage });
    return this._knex('settings')
      .insert({ key: 'scrapper', value })
      .onConflict('key')
      .merge();
  }

  async _getState() {
    const defaultValue = { _currentPage: 1 };
    const result = await this._knex
      .select('value')
      .from('settings')
      .where('key', 'scrapper')
      .first();
    return result ? JSON.parse(result.value) : defaultValue;
  }

  async goto(page, url, params) {
    const query = new URLSearchParams(params).toString();
    await page.goto(`${this._baseUrl}/${url}${query ? `?${query}` : ''}`, { timeout: 0, waitUntil: 'domcontentloaded' });
    await this._handleCaptcha(page);
    await this._injectGlobals(page);
    return page;
  }

  async _newPage(url, query) {
    const page = await this._browser.newPage();
    return url ? this.goto(page, url, query) : page;
  }

  async _injectGlobals(page) {
    return page.evaluate(globalScript);
  }

  async _getMovieLinks() {
    return this._filtersPage.$$eval('a[href]', (links) => links
      .filter((el) => el.getAttribute('href').match(/^\/film\/\d+\/$/))
      .map((el) => el.getAttribute('href'))
    );
  }

  async _getLastPage() {
    return this._filtersPage.$eval('.styles_smaller__SzWsn', (el) => +el.textContent);
  }

  async _handleCaptcha(page) {
    return this._captcha.handle(page);
  }

  async run() {
    console.log(chalk.green('Starting scrapping movies...'));
    const movies = [];
    const movieQueue = this.getMovieQueue();

    try {
      await this.goto(this._filtersPage, '/lists/movies/', { page: this._currentPage });

      const lastPage = await this._getLastPage();
      logger.info(`Total pages are ${lastPage}`);
      // start workers
      const tasks = [
        movieScrapper.run(this),
        crewScrapper.run(this),
        personScrapper.run(this)
      ];

      while (this._currentPage <= lastPage) {
        const links = await this._getMovieLinks();
        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          await movieQueue.enqueue(link);
        }

        ++this._currentPage;
        await this.goto(this._filtersPage, `/lists/movies/`, { page: this._currentPage });
      }

      await Promise.all(tasks);

      console.log(chalk.green('Scrapping done!'));
      console.log(chalk.gray(`Scrapped ${movies.length} movies`));
    } catch (err) {
      console.log(chalk.red(`Error!!! Current page is ${this._currentPage}`));
      console.log(chalk.red(err));
      await this._saveState();
      throw err;
    }
  }

  _extractMeta() {
    return this._filtersPage.evaluate(() => {
      const dropdowns = Array.from(document.querySelectorAll('details'));

      const extractValues = (label) => {
        const items = dropdowns.filter((item) => item.querySelector('summary').textContent === label).shift();
        items.querySelector('[data-tid="d773c274"] div').click();
        return Array.from(items.querySelectorAll('label span')).map((item) => ({ name: item.textContent }))
      };

      const countries = extractValues('Страны');
      const genres = extractValues('Жанры');

      countries.shift();
      genres.shift();

      return {
        countries,
        genres
      };
    });
  }

  async _saveCountries(countries) {
    return this._knex('countries')
      .insert(countries)
      .onConflict('id')
      .merge();
  }

  async _saveGenres(genres) {
    return this._knex('genres')
      .insert(genres)
      .onConflict('id')
      .merge();
  }

  _getMovieId(url) {
    const match = url.match(/^.+\/(\d+)\/$/);
    return match && match[1];
  }

  getCrewPage() {
    return this._crewPage;
  }

  getMoviePage() {
    return this._moviePage;
  }

  getPersonPage() {
    return this._personPage;
  }

  getPersonQueue() {
    return this._personQueue;
  }

  getMovieQueue() {
    return this._movieQueue;
  }

  getCrewQueue() {
    return this._crewQueue;
  }

  getKnex() {
    return this._knex;
  }
}

module.exports = ScrapeManager;
