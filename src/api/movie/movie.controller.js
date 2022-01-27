'use strict';

const { Http } = require('../../constants');
const service = require('./movie.service')

module.exports = {
  popular: async (req, res) => {
    const { page } = req.query;

    const result = await service.popular(page);
    return res.status(Http.OK).json(result);
  },

  topRated: async (req, res) => {
    const { page } = req.query;

    const result = await service.topRated(page);
    return res.status(Http.OK).json(result);
  },

  upcoming: async (req, res) => {
    const { page } = req.query;
    
    const result = await service.upcoming(page);
    return res.status(Http.OK).json(result);
  }
};
