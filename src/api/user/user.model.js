'use strict';

const Model = require('../../core/model');
const crypto = require('../../core/crypto');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  set password(password) {
    this._password = crypto.hash(password);
  }

  get password() {
    return this._password;
  }

  getData() {
    return {
      id: this.id,
    };
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email
    }
  }
}

module.exports = User;
