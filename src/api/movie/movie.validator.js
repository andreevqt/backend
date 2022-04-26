'use strict';

const Yup = require('yup');

module.exports = {
  pagination: Yup.object({
    page: Yup.number(),
    perPage: Yup.number(),
    filter: Yup.mixed().oneOf(['top', 'upcoming', 'latest']).default('latest')
  })
};
