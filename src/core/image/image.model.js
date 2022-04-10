'use strict';

const Model = require('../model');

class Image extends Model {
  static get tableName() {
    return 'images';
  }

  static get jsonAttributes() {
    return ['formats'];
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      mimetype: this.mimetype,
      size: this.size,
      width: this.width,
      height: this.height,
      url: this.url,
      formats: this.formats
    };
  }
}

module.exports = Image;
