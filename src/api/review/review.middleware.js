'use stirct';

const asyncHandler = require('express-async-handler');
const { Http } = require('../../constants');

module.exports.isAuthor = asyncHandler(async (req, res, next) => {
  const { currentUser, review } = res.locals;
  if (currentUser.id !== review.author.id) {
    return res.status(Http.FORBIDDEN).json({ success: false, message: 'Review should belong to current user' });
  }

  next();
});
