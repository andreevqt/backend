'use strict';

const requests = require('../../core/requests');

module.exports.configuration = async () => {
  return (await requests.tmdb.get('/configuration')).data;
};

