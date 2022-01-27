'use strict';

const { Migrator } = require('../core/migrators');

module.exports = async ({ type }) => {
  const migrator = new Migrator();
  try {
    await migrator.init();
    if (type === 'migrate') {
      await migrator.migrate();
    } else if (type === 'refresh') {
      await migrator.refresh();
    } else {
      throw new Error('Unknown migration type');
    }
  } catch (err) {
    throw err;
  } finally {
    await migrator.destroy();
  }
};
