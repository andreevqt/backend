'use strict';

const { program } = require('commander');
const pkg = require('../package.json');
const { serve, migrate, seed } = require('./commands');

program.version(pkg.version);

program
  .command('serve [port]')
  .description('start application server')
  .action(serve);

program.command('migrate')
  .description('run migrations')
  .option('-t, --type <migration_type>', 'migration type')
  .action(migrate);

program.command('seed')
  .description('run seeders')
  .option('-c, --count <count>', 'count of entries to insert')
  .action(seed);

program.parse(process.argv);
