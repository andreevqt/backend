'use strict';

const Model = require('../../core/model');
const User = require('../user/user.model');

class Review extends Model {
  static get tableName() {
    return 'reviews';
  }

  static relationMappings = {
    author: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'reviews.authorId',
        to: 'users.id'
      }
    }
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      author: this.author,
      movieId: this.movieId
    }
  }
}

module.exports = Review;
