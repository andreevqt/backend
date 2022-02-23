'use strict';

const _ = require('lodash');
const { tmdb } = require('../../core/requests');
const genreRepository = require('../genre/genre.repository');

const transformMovie = async (movie) => _.omit({
  ...movie,
  genres: await genreRepository.findByIds(movie.genre_ids)
}, 'genre_ids');

const transformMovies = (movies = []) => Promise.all(movies
  .map(async (movie) => transformMovie(movie)));

const transformResult = async ({ data }) => ({ ...data, results: await transformMovies(data.results) });

module.exports.popular = async (page = 1) => {
  return tmdb
    .get('/movie/popular', { params: { page } })
    .then(transformResult);
};

module.exports.topRated = (page = 1) => {
  return tmdb
    .get('/movie/top_rated', { params: { page } })
    .then(transformResult);
};

module.exports.upcoming = (page = 1) => {
  return tmdb
    .get('/movie/upcoming', { params: { page } })
    .then(transformResult);
};

module.exports.playing = (page = 1) => {
  return tmdb
    .get('/movie/now_playing', { params: { page } })
    .then(transformResult);
};

module.exports.similar = (id, page = 1) => {
  return tmdb
    .get(`/movie/${id}/similar`, { params: { page } })
    .then(transformResult);
};

module.exports.recommended = (id, page = 1) => {
  return tmdb
    .get(`/movie/${id}/recommendations`, { params: { page } })
    .then(transformResult);
};

module.exports.get = async (id) => {
  return tmdb
    .get(`/movie/${id}?append_to_response=credits`)
    .then((response) => response.data)
    .catch((err) => { }); // ingore error
};
