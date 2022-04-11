'use strict';

const Yup = require('yup');

module.exports = {
  create: Yup.object({
    name: Yup.string().required(),
    password: Yup.string().required(),
    email: Yup.string().email().required(),
    vk: Yup.string().nullable(true),
    facebook: Yup.string().nullable(true),
    telegram: Yup.string().nullable(true)
  }).noUnknown(true),

  update: Yup.object({
    name: Yup.string(),
    password: Yup.string(),
    email: Yup.string().email(),
    vk: Yup.string().nullable(true),
    facebook: Yup.string().nullable(true),
    telegram: Yup.string().nullable(true)
  }).noUnknown(true),

  token: Yup.object({
    token: Yup.string().required()
  }).noUnknown(true),

  login: Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required()
  }).noUnknown(true),

  logout: Yup.object({
    token: Yup.string().required()
  }).noUnknown(true),

  pagination: Yup.object({
    page: Yup.number(),
    perPage: Yup.number()
  }).noUnknown(true)
};
