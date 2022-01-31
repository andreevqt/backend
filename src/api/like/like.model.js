'use strict';

const Model = require('../../core/model');
const User = require('../user/user.model');

class Like extends Model {
  static get tableName() {
    return 'likes';
  }

  static relationMappings = {
    author: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'likes.authorId',
        to: 'users.id'
      }
    }
  }

  toJSON() {
    return {
      id: this.id,
      author: this.author
    }
  }
}

module.exports = Like;
