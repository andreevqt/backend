'use strict';

const Model = require('../../core/model');

class Like extends Model {
  static get tableName() {
    return 'likes';
  }

  static get relationMappings() {
    const User = require('../user/user.model');

    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'likes.authorId',
          to: 'users.id'
        }
      }
    };
  }

  toJSON() {
    return {
      id: this.id,
      likeableId: this.likeableId,
      likeableType: this.likeableType,
      author: this.author
    };
  }
}

module.exports = Like;
