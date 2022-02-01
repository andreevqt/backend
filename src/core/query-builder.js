'use strict';

const { QueryBuilder: BaseQueryBuilder } = require('objection');

class QueryBuilder extends BaseQueryBuilder {
  async page(page = 1, perPage = 15) {
    const { results, total } = await super.page(page - 1, perPage);
    const totalPages = Math.ceil(total / perPage);
    return { page, total, totalPages, results };
  }
}

module.exports = QueryBuilder;
