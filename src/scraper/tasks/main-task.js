'use strict';

const BaseTask = require('./base-task');
const ListVisitor = require('../visitors/list-visitor');
const { Commands } = require('../extractor');
const MovieTable = require('../tables/movie-table');

class MainTask extends BaseTask {
  constructor(manager, page) {
    super(manager, page, 'main-task');
    this.doMovie = this.doMovie.bind(this);
    this._movieTable = new MovieTable(manager.knex);
  }

  getVisitor() {
    return new ListVisitor('main', 'https://kinopoisk.ru/lists/movies', this);
  }

  async doMovie({ page, data: link }) {
    await this.goto(link, page);
    const { movie, countries, genres } = await this.execute(page, Commands.EXTRACT_MOVIE);
    await this._movieTable.upsert(movie, countries, genres);
  }

  async processLink(link) {
    return this._manager.execute(link, this.doMovie);
  }
}

module.exports = MainTask;
