'use strict';

const requests = require('../../core/requests');
const _ = require('lodash');

module.exports.popular = (page = 1) => {
  return requests.tmdb
    .get('/movie/popular', { params: { page } })
    .then((response) => response.data);
};

module.exports.topRated = (page = 1) => {
  return requests.tmdb
    .get('/movie/top_rated', { params: { page } })
    .then((response) => response.data);
};

module.exports.upcoming = (page = 1) => {
  return requests.tmdb
    .get('/movie/upcoming', { params: { page } })
    .then((response) => response.data);
};

module.exports.playing = (page = 1) => {
  return requests.tmdb
    .get('/movie/now_playing', { params: { page } })
    .then((response) => response.data);
};

module.exports.similar = (id, page = 1) => {
  return requests.tmdb
    .get(`/movie/${id}/similar`, { params: { page } })
    .then((response) => response.data);
};

module.exports.recommended = (id, page = 1) => {
  return requests.tmdb
    .get(`/movie/${id}/recommendations`, { params: { page } })
    .then((response) => response.data);
};

module.exports.get = async (id) => {
  return requests.tmdb
    .get(`/movie/${id}?append_to_response=credits`)
    .then((response) => response.data)
    .catch((err) => { }); // ingore error
};
