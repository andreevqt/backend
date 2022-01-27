'use strict';

const Yup = require('yup');

module.exports = {
  create: Yup.object({
    name: Yup.string().required(),
    password: Yup.string().required(),
    email: Yup.string().email().required()
  }),

  update: Yup.object({
    name: Yup.string(),
    password: Yup.string(),
    email: Yup.string().email()
  })
};
