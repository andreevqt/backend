'use strict';

const Model = require('../model');

class Settings extends Model {
  static get tableName() {
    return 'settings';
  }

  static get jsonAttributes() {
    return ['value'];
  }
}

module.exports = Settings;
