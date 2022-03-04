'use strict';

const { ref } = require('objection');
const Model = require('../../core/model');
const Image = require('../../core/image/image.model');
const crypto = require('../../core/crypto');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    const Review = require('../review/review.model');

    return {
      image: {
        relation: Model.HasOneRelation,
        modelClass: Image,

        filter: (builder) => {
          builder.where('imageableType', 'User');
        },

        beforeInsert: (model) => {
          model.imageableType = 'User';
        },

        join: {
          from: 'users.id',
          to: 'images.imageableId'
        }
      },
      reviews: {
        relation: Model.HasManyRelation,
        modelClass: Review,
        join: {
          from: 'users.id',
          to: 'reviews.authorId'
        }
      }
    }
  }

  static get modifiers() {
    const Review = require('../review/review.model');

    return {
      default: (query) => query
        .withGraphFetched('image')
        .select([
          'users.*',
          Review.query()
            .where('authorId', ref('users.id'))
            .count()
            .as('reviewsCount')
        ])
    };
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
      email: this.email,
      image: this.image,
      reviewsCount: this.reviewsCount
    }
  }
}

module.exports = User;
