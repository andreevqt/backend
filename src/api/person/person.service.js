'use strict';

const requests = require('../../core/requests');
const _ = require('lodash');

module.exports.get = async (id) => {
  return requests.tmdb
    .get(`/person/${id}`)
    .then((response) => response.data)
    .catch((err) => { }); // ingore error
};

module.exports.credits = async (personId) => {
  return requests.tmdb
    .get(`/person/${personId}/movie_credits`)
    .then((response) => response.data);
};

module.exports.popular = async (page = 1) => {
  return requests.tmdb
    .get('/person/popular', { params: { page } })
    .then((response) => response.data);
};
