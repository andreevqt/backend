'use strict';

const Yup = require('yup');

module.exports = {
  create: Yup.object({
    name: Yup.string().required(),
    password: Yup.string().required(),
    email: Yup.string().email().required(),
    vk: Yup.string(),
    facebook: Yup.string(),
    telegram: Yup.string()
  }),

  update: Yup.object({
    name: Yup.string(),
    password: Yup.string(),
    email: Yup.string().email(),
    vk: Yup.string(),
    facebook: Yup.string(),
    telegram: Yup.string()
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
  })
};
