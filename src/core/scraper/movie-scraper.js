'use strict';

const chalk = require('chalk');
const logger = require('../../logger');

const script = () => {
  const { extractValue, extractArray } = window.scrapper.table;
  const { getTitle, getOriginalTitle, getDescription, getPoster, getType } = window.scrapper.movie;
  const { getId } = window.scrapper.page;

  const title = getTitle();
  const originalTitle = getOriginalTitle();

  const id = getId();
  const description = getDescription();

  const poster = getPoster();
  const type = getType();

  const year = +extractValue('Год производства');
  const slogan = extractValue('Слоган') || '-';
  const budget = extractValue('Бюджет');

  const feesWorld = extractValue('Сборы в мире', (row) => row.querySelector('a').textContent);
  const feesUSA = extractValue('Сборы в США');
  const feesRussia = extractValue('Сборы в России');
  const age = extractValue('Возраст', (row) => row.querySelector('span').textContent);
  const duration = extractValue('Время');

  const ratingEl = document.querySelector('.film-rating-value');
  const rating = ratingEl && +ratingEl.textContent;

  const votesEl = document.querySelector('[class^="styles_count"]');
  const votes = votesEl && +votesEl.textContent.match(/\d/g).join('');

  const countries = extractArray('Страна');
  const genres = extractArray('Жанр');

  const movie = {
    id,
    title,
    originalTitle,
    type,
    rating,
    votes,
    year,
    slogan,
    poster,
    description,
    budget,
    feesWorld,
    feesUSA,
    feesRussia,
    age,
    duration
  };

  return {
    movie,
    genres,
    countries
  };
};

const getMovieId = (url) => {
  const match = url.match(/^.+\/(\d+)\/$/);
  return match && match[1];
};

let count = 1;

const run = async (manager) => {
  const knex = manager.getKnex();
  const moviePage = manager.getMoviePage();
  const movieQueue = manager.getMovieQueue();
  const crewQueue = manager.getCrewQueue();

  const addCountry = async (movieId, countryName) => {
    const country = await knex.select('*')
      .from('countries')
      .where('name', countryName)
      .first();

    if (!country) {
      return;
    }

    await knex('movies_countries')
      .insert({ movieId, countryId: country.id })
      .onConflict(['movieId', 'countryId'])
      .merge();
  };

  const addGenre = async (movieId, genreName) => {
    const genre = await knex.select('*')
      .from('genres')
      .where('name', genreName)
      .first();

    if (!genre) {
      return;
    }

    await knex('movies_genres')
      .insert({ movieId, genreId: genre.id })
      .onConflict(['movieId', 'genreId'])
      .merge();
  };

  const upsert = async (movie, countries, genres) => {
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      await addCountry(movie.id, country);
    }

    for (let i = 0; i < genres.length; i++) {
      const genre = genres[i];
      await addGenre(movie.id, genre);
    }

    return knex('movies').insert({ ...movie, lastSync: knex.raw('now()') })
      .onConflict('id')
      .merge();
  };

  let link;
  while (link = await movieQueue.dequeue()) {
    const movieId = getMovieId(link);
    await crewQueue.enqueue(`/film/${movieId}/cast/who_is/actor`);
    await manager.goto(moviePage, link);
    const { movie, countries, genres } = await moviePage.evaluate(script);
    await upsert(movie, countries, genres);

    logger.info(`Processed movie ${movie.id}. Total movies processed ${count}`);
    count++;
  }
};

module.exports.run = run;
