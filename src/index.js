'use strict';

const { program } = require('commander');
const pkg = require('../package.json');
const { serve, migrate, seed, secret } = require('./commands');

program.version(pkg.version);

program
  .command('serve [port]')
  .description('start api server')
  .action(serve);

program.command('migrate')
  .description('run migrations')
  .option('-t, --type <migration_type>', 'migration type')
  .action(migrate);

program.command('seed')
  .description('run seeders')
  .action(seed);

program.command('secret')
  .description('generate app key')
  .action(secret);

program.parse(process.argv);
