'use strict';

const { ref } = require('objection');
const Model = require('../../core/model');

class Review extends Model {
  static get tableName() {
    return 'reviews';
  }

  static get jsonAttributes() {
    return ['movie'];
  }

  static get relationMappings() {
    const User = require('../user/user.model');
    const Comment = require('../comment/comment.model');
    const Like = require('../like/like.model');

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
      },

      likes: {
        relation: Model.HasManyRelation,
        modelClass: Like,

        filter: (builder) => {
          builder.where('likeableType', 'Review');
        },

        beforeInsert: (model) => {
          model.likeableType = 'Review';
        },

        join: {
          from: 'reviews.id',
          to: 'likes.likeableId'
        }
      }
    };
  }

  static get modifiers() {
    const Like = require('../like/like.model');

    return {
      defaultSelect: (query, currentUserId) => {
        return query
          .withGraphFetched('[author(default)]')
          .select([
            'reviews.*',
            Like.query()
              .where('likeableId', ref('reviews.id'))
              .where('likeableType', 'Review')
              .count()
              .as('likesCount'),
            Like.query()
              .skipUndefined()
              .where('likeableId', ref('reviews.id'))
              .where('likeableType', 'Review')
              .where('authorId', currentUserId)
              .where('likeableType', 'Review')
              .count()
              .as('liked')
          ])
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
      movie: this.movie,
      rating: this.rating,
      createdAt: this.created_at,
      likesCount: this.likesCount,
      liked: !!this.liked
    };
  }
}

module.exports = Review;
