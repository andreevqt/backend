'use strict';

const { Router } = require('express');
const movies = require('./movie/movie.route');
const genres = require('./genre/genre.route');
const persons = require('./person/person.route');
const users = require('./user/user.route');
const reviews = require('./review/review.route');
const comments = require('./comment/comment.route');
const common = require('./common/common.route');

const router = new Router();

// init movies
movies(router);
// init genres
genres(router);
// init persons
persons(router);
// init users
users(router);
// init reviews
reviews(router);
// init comments
comments(router);
// init common
common(router);

module.exports = router;
