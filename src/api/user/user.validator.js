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
  }),

  token: Yup.object({
    token: Yup.string().required()
  }),

  login: Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required()
  }),

  logout: Yup.object({
    token: Yup.string().required()
  }),

  pagination: Yup.object({
    page: Yup.number(),
    perPage: Yup.number()
  })
};
