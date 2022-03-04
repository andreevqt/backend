'use strict';

const Yup = require('yup');

module.exports = {
  create: Yup.object({
    title: Yup.string().min(3).max(1024).required(),
    content: Yup.string().required(),
    rating: Yup.number().required().min(1).max(10)
  }),

  update: Yup.object({
    title: Yup.string().min(3).max(1024),
    content: Yup.string(),
    rating: Yup.number().min(1).max(10)
  })
};
