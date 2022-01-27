'use strict';

const logger = require('../../logger');

module.exports = (req, res, next) => {
  logger.debug(`[REQUEST]: method - ${req.method}, url - ${req.url}, body - ${JSON.stringify(req.body)}`);

  const afterResponse = () => {
    logger.debug(`[RESPONSE]: method - ${req.method}, url - ${req.url}, status - ${res.statusCode}`);
    res.removeListener('finish', afterResponse);
    res.removeListener('close', afterResponse);
  };

  res.on('close', afterResponse);
  res.on('finish', afterResponse);

  next();
};
