'use strict';

const { program } = require('commander');
const pkg = require('../package.json');
const { serve, migrate, seed, secret, scrape } = require('./commands');

program.version(pkg.version);

program
  .command('serve [port]')
  .description('start api server')
  .action(serve);

program.command('migrate')
  .description('run migrations')
  .option('-t, --type <migration_type>', 'migration type')
  .action(migrate);

program.command('seed [count]')
  .description('run seeders')
  .action(seed);

program.command('secret')
  .description('generate app key')
  .action(secret);

program.command('scrape')
  .description('scrape kinopoisk')
  .action(scrape);

program.parse(process.argv);
