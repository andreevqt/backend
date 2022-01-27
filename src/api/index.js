'use strict';

const { Router } = require('express');
const movies = require('./movie/movie.route');

const router = new Router();

// init movies
movies(router);

module.exports = router;
