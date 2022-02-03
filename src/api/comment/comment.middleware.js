'ust stirct';

const asyncHandler = require('express-async-handler');
const { Http } = require('../../constants');

module.exports.isCommentsAuthor = asyncHandler(async (req, res, next) => {
  const { currentUser, comment } = res.locals;
  if (currentUser.id !== comment.author.id) {
    return res.status(Http.FORBIDDEN).json({status: 'The comment doesn\'t belong to you'});
  }
  next();
});
