'use strict';

const crypto = require('../core/crypto');
const { updateEnv } = require('../utils');

module.exports = () => {
  return updateEnv({
    'APP_SECRET': crypto.secret()
  });
};
