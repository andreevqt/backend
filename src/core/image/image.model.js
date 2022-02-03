'use strict';

const Model = require('../model');

class Image extends Model {
  static get tableName() {
    return 'images';
  }

  static get jsonAttributes() {
    return ['formats'];
  }
}

module.exports = Image;
