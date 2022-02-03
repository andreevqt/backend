'use strict';

const axios = require('axios');

module.exports.configuration = async () => {
  return (await axios.get('/configuration')).data;
};

