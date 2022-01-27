'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const SECRET_LEN = 48;

const hash = (password) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

const compare = (pass, hashed) => {
  return bcrypt.compareSync(pass, hashed);
};

const secret = () => {
  const buffer = crypto.randomBytes(SECRET_LEN);
  return buffer.toString('hex');
};

module.exports = {
  hash,
  compare,
  secret
};
