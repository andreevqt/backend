'use strict';

const Model = require('../../core/model');

class Genre extends Model {
  static get tableName() {
    return 'genres';
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name
    };
  }
}

module.exports = Genre;
