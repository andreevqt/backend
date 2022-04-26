'use strict';

const LIMIT = 1000;

const repairTask = (manager) => async ({ data }) => {
  const { knex } = manager;
  const { total } = await knex('movies').count('title', { as: 'total' }).first();

  let page = 1;
  let offset = 0;

  while ((offset = LIMIT * (page - 1)) <= total) {
    const ids = await knex.select('id')
      .from('movies')
      .offset(offset)
      .limit(LIMIT)
      .then((ids) => ids.map(({ id }) => id));
    page++;
  }
};

module.exports = repairTask;
