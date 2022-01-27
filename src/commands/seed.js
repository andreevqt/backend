'use strict';

const { Seeder } = require('../core/migrators');

module.exports = async ({ count = 100 }) => {
  const seeder = new Seeder();
  try {
    await seeder.init();
    await seeder.seed(count);
  } catch (err) {
    throw err;
  } finally {
    await seeder.destroy();
  }
};
