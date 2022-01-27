'use strict';

const { Http } = require('../../constants');
const service = require('./person.service')

module.exports = {
  get: async (req, res) => {
    const { personId } = req.params;

    const result = await service.get(personId);
    return res.status(Http.OK).json(result);
  },

  popular: async (req, res) => {
    const { page } = req.query;
    
    const result = await service.popular(page);
    return res.status(Http.OK).json(result);
  },

  credits: async (req, res) => {
    const { personId } = req.params;

    const result = await service.credits(personId);
    return res.status(Http.OK).json(result);
  }
};
