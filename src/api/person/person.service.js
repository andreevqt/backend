'use strict';

const axios = require('axios');
const _ = require('lodash');

module.exports.get = async (personId) => {
  return (await axios.get(`/person/${personId}`)).data;
};

module.exports.credits = async (personId) => {
  return (await axios.get(`/person/${personId}/movie_credits`)).data;
};

module.exports.popular = async (page = 1) => {
  return (await axios.get('/person/popular', { params: { page } })).data;
};
