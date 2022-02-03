'use strict';

const Model = require('../../core/model');
const User = require('../user/user.model');

class Comment extends Model {
  static get tableName() {
    return 'comments';
  }

  static relationMappings = {
    author: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'comments.authorId',
        to: 'users.id'
      }
    }
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      commentableId: this.commentableId,
      commentableType: this.commentableType,
      author: this.author
    }
  }
};

module.exports = Comment;
