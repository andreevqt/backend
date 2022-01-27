'use strict';

const { Model: BaseModel } = require('objection');
const QueryBuilder = require('./query-builder');

class Model extends BaseModel {
  static get QueryBuilder() {
    return QueryBuilder;
  }
}

module.exports = Model;
