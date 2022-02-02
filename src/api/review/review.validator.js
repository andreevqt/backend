'use strict';

const Yup = require('yup');

module.exports = {
  create: Yup.object({
    title: Yup.string().min(3).max(1024).required(),
    content: Yup.string().required()
  }),

  update: Yup.object({
    title: Yup.string().min(3).max(1024),
    content: Yup.string()
  })
};
