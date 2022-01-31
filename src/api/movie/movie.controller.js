'use strict';

const asyncHandler = require('express-async-handler');
const { Http } = require('../../constants');
const movieService = require('./movie.service');
const likeService = require('../like/like.service');

module.exports = {
  get: asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    try {
      const result = await movieService.get(movieId);
      res.status(Http.OK).json(result);
    } catch (err) {
      res.status(Http.NOT_FOUND).json({ success: false, message: 'Not found' });
    }
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

  likes: {
    get: asyncHandler(async (req, res) => {
      const { page } = req.query;
      const { movieId } = req.params;

      const result = await likeService.get({
        likeableType: 'Movie',
        likeableId: movieId,
        page
      });

      res.status(Http.OK).json(result);
    }),

    create: asyncHandler(async (req, res) => {
      const { movieId } = req.params;
      const { currentUser } = res.locals;

      const query = {
        likeableType: 'Movie',
        likeableId: movieId,
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
      const { likeId } = req.params;
      const { currentUser } = res.locals;

      const deleted = await likeService.drop(currentUser.id, likeId);
      if (!deleted) {
        return res.status(Http.NOT_FOUND).json({ success: false, message: 'Couldn\'t find a like' });
      }

      res.status(Http.OK).json({success: true, message: 'Deleted'});
    })
  }
};
