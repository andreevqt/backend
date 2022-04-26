'use strict';

const Model = require('../../core/model');

class Movie extends Model {
  static get tableName() {
    return 'movies';
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      originalTitle: this.originalTitle,
      rating: this.rating,
      votes: this.votes,
      type: this.type,
      slogan: this.slogan,
      poster: this.poster,
      description: this.description,
      budget: this.budget,
      feesWorld: this.feesWorld,
      feesUSA: this.feesUSA,
      feesRussia: this.feesRussia,
      age: this.age,
      year: this.year,
      duration: this.duration,
      lastSync: this.lastSync
    };
  }
}

module.exports = Movie;

