'use stirct';

const Model = require('../../../../core/model');

class Refresh extends Model {
  static get tableName() {
    return 'refresh_tokens';
  }
}

module.exports = Refresh;
