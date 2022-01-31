'use strict';

const asyncHandler = require('express-async-handler');
const { Http } = require('../../constants');
const personService = require('./person.service')
const likeService = require('../like/like.service');

module.exports = {
  get: asyncHandler(async (req, res) => {
    const { personId } = req.params;

    const result = await personService.get(personId);
    return res.status(Http.OK).json(result);
  }),

  popular: asyncHandler(async (req, res) => {
    const { page } = req.query;

    const result = await personService.popular(page);
    return res.status(Http.OK).json(result);
  }),

  credits: asyncHandler(async (req, res) => {
    const { personId } = req.params;

    const result = await personService.credits(personId);
    return res.status(Http.OK).json(result);
  }),

  likes: {
    get: asyncHandler(async (req, res) => {
      const { page } = req.query;
      const { personId } = req.params;

      const result = await likeService.get({
        likeableType: 'Person',
        likeableId: personId,
        page
      });

      res.status(Http.OK).json(result);
    }),

    create: asyncHandler(async (req, res) => {
      const { personId } = req.params;
      const { currentUser } = res.locals;

      const query = {
        likeableType: 'Person',
        likeableId: personId,
        authorId: currentUser.id
      };

      const hasLike = await likeService.hasLike(query);
      if (hasLike) {
        return res.status(Http.CONFLICT).json({ success: false, message: 'Only one like per person is allowed' });
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
