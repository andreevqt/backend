'use strict';

const BaseTask = require('./base-task');
const ListVisitor = require('../visitors/list-visitor');
const { Commands } = require('../extractor');
const MovieTable = require('../tables/movie-table');

class MainTask extends BaseTask {
  constructor(manager, page) {
    super(manager, page, 'main-task');
    this._scrapeMovie = this._scrapeMovie.bind(this);
    this._scrapeSimilarMovies = this._scrapeSimilarMovies.bind(this);
    this._movieTable = new MovieTable(manager.knex);
  }

  getVisitor() {
    return new ListVisitor('main', 'https://kinopoisk.ru/lists/movies', this);
  }

  async _scrapeMovie({ page, data: link }) {
    await this.goto(link, page);
    const { movie, countries, genres } = await this.execute(page, Commands.EXTRACT_MOVIE);
    await this._movieTable.upsert(movie, countries, genres);
  }

  async _scrapeSimilarMovies({ page, data: link }) {
    await this.goto(link, page);
    console.log(link);

    const links = await page.$$eval('tr a.all[href]', (links) => links
      .filter((el) => el.getAttribute('href').match(/^\/(film|series)\/\d+\/$/))
      .map((el) => el.href));

    console.log(links);

    await Promise.all(links.map((link) => this._manager.execute(link, this._scrapeMovie)));
    console.log('here');
  }

  getMovieId(url) {
    const match = url.match(/^.+\/(\d+)\/$/);
    return match && match[1];
  }

  async processLink(link) {
    const tasks = [];
    tasks.push(this._manager.execute(link, this._scrapeMovie));

    const id = this.getMovieId(link);
    tasks.push(this._manager.execute(`http://kinopoisk.ru/film/${id}/like`, this._scrapeSimilarMovies));

    return Promise.all(tasks);
  }
}

module.exports = MainTask;
