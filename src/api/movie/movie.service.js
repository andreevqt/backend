'use strict';

const axios = require('axios');
const _ = require('lodash');

module.exports.popular = async (page = 1) => {
  return (await axios.get('/movie/popular', { params: { page } })).data;
};

module.exports.topRated = async (page = 1) => {
  return (await axios.get('/movie/top_rated', { params: { page } })).data;
};

module.exports.upcoming = async (page = 1) => {
  return (await axios.get('/movie/upcoming', { params: { page } })).data;
};

module.exports.get = async (id) => {
  try {
    const movie = (await axios.get(`/movie/${id}?append_to_response=credits`)).data;
    return movie;
  } catch (err) {} // ignore error
};
