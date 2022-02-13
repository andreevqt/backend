'use strict';

const axios = require('axios');
const _ = require('lodash');

module.exports.popular = (page = 1) => {
  return axios.get('/movie/popular', { params: { page } }).then((response) => response.data);
};

module.exports.topRated = (page = 1) => {
  return axios.get('/movie/top_rated', { params: { page } }).then((response) => response.data);
};

module.exports.upcoming = (page = 1) => {
  return axios.get('/movie/upcoming', { params: { page } }).then((response) => response.data);
};

module.exports.get = async (id) => {
  try {
    const movie = (await axios.get(`/movie/${id}?append_to_response=credits`)).data;
    return movie;
  } catch (err) {} // ignore error
};
