'use strict';

const { timeout, randomInt } = require('../utils')

module.exports = (min = 1500, max = 3000) => {
  return timeout(randomInt(min, max));
};
