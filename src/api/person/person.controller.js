'use strict';

const asyncHandler = require('express-async-handler');
const { Http } = require('../../constants');
const personService = require('./person.service')
const likeService = require('../like/like.service');
const { validateId } = require('../../utils');

module.exports = {
  checkPerson: asyncHandler(async (req, res, next, id) => {
    if (!validateId(id)) {
      return res.status(Http.BAD_REQUEST).json({ success: false, message: 'Id should be a number' });
    }

    const person = await personService.get(id);
    if (!person) {
      return res.status(Http.NOT_FOUND).json({ success: false, message: 'Person not found' });
    }

    res.locals.person = person;
    next();
  }),

  get: asyncHandler(async (req, res) => {
    const { person } = res.locals;
    return res.status(Http.OK).json(person);
  }),

  popular: asyncHandler(async (req, res) => {
    const { page } = req.query;

    const result = await personService.popular(page);
    return res.status(Http.OK).json(result);
  }),

  credits: asyncHandler(async (req, res) => {
    const { person } = res.locals;
    const result = await personService.credits(person.id);
    return res.status(Http.OK).json(result);
  }),

  likes: {
    get: asyncHandler(async (req, res) => {
      const { page } = req.query;
      const { person } = res.locals;

      const result = await likeService.get({
        likeableType: 'Person',
        likeableId: person.id,
        page
      });

      res.status(Http.OK).json(result);
    }),

    create: asyncHandler(async (req, res) => {
      const { currentUser, person } = res.locals;

      const query = {
        likeableType: 'Person',
        likeableId: person.id,
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
      const { currentUser, person } = res.locals;

      const query = {
        likeableType: 'Person',
        likeableId: person.id,
        authorId: currentUser.id
      };

      const deleted = await likeService.drop(query);
      if (!deleted) {
        return res.status(Http.NOT_FOUND).json({ success: false, message: 'Couldn\'t find a like' });
      }

      res.status(Http.OK).json({ success: true, message: 'Deleted' });
    })
  }
};
