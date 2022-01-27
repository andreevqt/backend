'use strict';

const { QueryBuilder: BaseQueryBuilder } = require('objection');

class QueryBuilder extends BaseQueryBuilder {
  page(page = 1, perPage = 15) {
    return super.page(page - 1, perPage);
  }
}

module.exports = QueryBuilder;
