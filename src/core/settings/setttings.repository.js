'use strict';

const Model = require('./settings.model');

module.exports.get = (key) => {
  return Model.query().findOne({ key });
};

module.exports.create = (key, value) => {
  return Model.query().insert({ key, value });
};

module.exports.update = (key, value) => {
  return Model.query().findOne({ key }).patchAndFetch({ value });
};
