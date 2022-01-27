'use strict';

const axios = require('axios');

module.exports.list = async (page = 1) => {
  const result = await axios.get('/genre/movie/list', { params: { page } });
  return result.data.genres;
};
