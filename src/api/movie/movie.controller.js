'use strict';

const asyncHandler = require('express-async-handler');
const { Http } = require('../../constants');
const movieService = require('./movie.service');
const likeService = require('../like/like.service');
const reviewService = require('../review/review.service');
const settingsService = require('../../core/settings/settings.service');
const { validateId } = require('../../utils');

module.exports = {
  checkMovie: asyncHandler(async (req, res, next, id) => {
    if (!validateId(id)) {
      return res.status(Http.BAD_REQUEST).json({ success: false, message: 'Id should be a number' });
    }

    const movie = await movieService.get(id);
    if (!movie) {
      return res.status(Http.NOT_FOUND).json({ success: false, message: 'Movie not found' });
    }

    res.locals.movie = movie;
    next();
  }),

  checkReview: asyncHandler(async (req, res, next, id) => {
    if (!validateId(id)) {
      return res.status(Http.BAD_REQUEST).json({ success: false, message: 'Id should be a number' });
    }

    const review = await reviewService.get(id);
    if (!review) {
      return res.status(Http.NOT_FOUND).json({ success: false, message: 'Movie not found' });
    }

    res.locals.review = review;
    next();
  }),

  get: asyncHandler(async (req, res) => {
    const { movie } = res.locals;
    res.status(Http.OK).json(movie);
  }),

  featured: asyncHandler(async (req, res) => {
    const results = await settingsService.get('featured_movies');
    const response = results && results.value ? results.value : [];
    res.status(Http.OK).json(response);
  }),

  popular: asyncHandler(async (req, res) => {
    const { page } = req.query;

    const result = await movieService.popular(page);
    res.status(Http.OK).json(result);
  }),

  topRated: asyncHandler(async (req, res) => {
    const { page } = req.query;

    const result = await movieService.topRated(page);
    res.status(Http.OK).json(result);
  }),

  upcoming: asyncHandler(async (req, res) => {
    const { page } = req.query;

    const result = await movieService.upcoming(page);
    res.status(Http.OK).json(result);
  }),

  playing: asyncHandler(async (req, res) => {
    const { page } = req.query;

    const result = await movieService.playing(page);
    res.status(Http.OK).json(result);
  }),

  similar: asyncHandler(async (req, res) => {
    const { page } = req.query;
    const { movie } = res.locals;

    const result = await movieService.similar(movie.id, page);
    res.status(Http.OK).json(result);
  }),

  recommended: asyncHandler(async (req, res) => {
    const { page } = req.query;
    const { movie } = res.locals;

    const result = await movieService.recommended(movie.id, page);
    res.status(Http.OK).json(result);
  }),

  likes: {
    get: asyncHandler(async (req, res) => {
      const { page } = req.query;
      const { movie } = res.locals;

      const result = await likeService.get({
        likeableType: 'Movie',
        likeableId: movie.id,
        page
      });

      res.status(Http.OK).json(result);
    }),

    create: asyncHandler(async (req, res) => {
      const { movie } = res.locals;
      const { currentUser } = res.locals;

      const query = {
        likeableType: 'Movie',
        likeableId: movie.id,
        authorId: currentUser.id
      };

      const hasLike = await likeService.hasLike(query);
      if (hasLike) {
        return res.status(Http.CONFLICT).json({ success: false, message: 'Only one like per movie is allowed' });
      }

      const like = await likeService.create(query);
      res.status(Http.CREATED).json({ success: true, like });
    }),

    delete: asyncHandler(async (req, res) => {
      const { currentUser, movie } = res.locals;

      const query = {
        likeableType: 'Movie',
        likeableId: movie.id,
        authorId: currentUser.id
      };

      const deleted = await likeService.drop(query);
      if (!deleted) {
        return res.status(Http.NOT_FOUND).json({ success: false, message: 'Couldn\'t find a like' });
      }

      res.status(Http.OK).json({ success: true, message: 'Deleted' });
    })
  },

  reviews: {
    list: asyncHandler(async (req, res) => {
      const { movieId } = req.params;
      const { page = 1, perPage = 15 } = req.query;
      const result = await reviewService.listByMovie(movieId, +page, +perPage);
      res.status(Http.OK).json(result);
    }),

    create: asyncHandler(async (req, res) => {
      const attrs = req.body;
      const { movie, currentUser } = res.locals;
      const review = await reviewService.create(movie.id, { authorId: currentUser.id, ...attrs });
      res.status(Http.CREATED).json({ success: true, review });
    }),
  }
};
