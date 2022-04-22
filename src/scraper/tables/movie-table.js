'use strict';

const BaseTable = require('./base-table');

class MovieTable extends BaseTable {
  async _addCountry(movieId, countryName) {
    const country = await this._knex.select('*')
      .from('countries')
      .where('name', countryName)
      .first();

    if (!country) {
      return;
    }

    await this._knex('movies_countries')
      .insert({ movieId, countryId: country.id })
      .onConflict(['movieId', 'countryId'])
      .merge();
  }

  async _addGenre(movieId, genreName) {
    const genre = await this._knex.select('*')
      .from('genres')
      .where('name', genreName)
      .first();

    if (!genre) {
      return;
    }

    await this._knex('movies_genres')
      .insert({ movieId, genreId: genre.id })
      .onConflict(['movieId', 'genreId'])
      .merge();
  }

  async upsert(movie, countries = [], genres = []) {
    if (!movie) {
      return;
    }

    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      await this._addCountry(movie.id, country);
    }

    for (let i = 0; i < genres.length; i++) {
      const genre = genres[i];
      await this._addGenre(movie.id, genre);
    }

    return this._knex('movies')
      .insert({ ...movie, lastSync: this._knex.raw('now()') })
      .onConflict('id')
      .merge();
  }
}

module.exports = MovieTable;

