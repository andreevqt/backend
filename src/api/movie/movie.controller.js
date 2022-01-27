'use strict';

const { Http } = require('../../constants');

module.exports = {
  list: (req, res) => {
    return res.status(Http.OK).json([]);
  }
};
