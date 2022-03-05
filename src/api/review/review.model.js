'use strict';

const Model = require('../../core/model');
const Comment = require('../comment/comment.model');

class Review extends Model {
  static get tableName() {
    return 'reviews';
  }

  static get relationMappings() {
    const User = require('../user/user.model');

    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'reviews.authorId',
          to: 'users.id'
        }
      },

      comments: {
        relation: Model.HasManyRelation,
        modelClass: Comment,

        filter: (builder) => {
          builder.where('commentableType', 'Review');
        },

        beforeInsert: (model) => {
          model.commentableType = 'Review';
        },

        join: {
          from: 'reviews.id',
          to: 'comments.commentableId'
        }
      }
    };
  }

  static get modifiers() {
    return {
      default: (query) => {
        return query.withGraphFetched('author(default)')
      }
    };
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      author: this.author,
      movieId: this.movieId,
      rating: this.rating,
      createdAt: this.createdAt
    };
  }
}

module.exports = Review;
