'use strict';

const { Seeder } = require('../core/migrators');

module.exports = async () => {
  const seeder = new Seeder();
  try {
    await seeder.init();
    await seeder.seed();
  } catch (err) {
    throw err;
  } finally {
    await seeder.destroy();
  }
};
