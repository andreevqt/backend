'use strict';

class KinopoiskError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Kinopoisk API error';
  }
};

module.exports = KinopoiskError;
