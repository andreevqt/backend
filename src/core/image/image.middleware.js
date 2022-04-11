'use strict';

const multer = require('multer');
const { Http } = require('../../constants');

module.exports.createUpload = (allowed = ['image/jpeg', 'image/png']) => {
  const upload = multer({
    fileFilter: (req, file, cb) => {
      if (!allowed.includes(file.mimetype)) {
        return cb(new Error('Wrong mime type'), false);
      }
      cb(null, true);
    }
  });

  return (field) => (req, res, next) => {
    const middleware = upload.single(field);
    middleware(req, res, function(err) {
      if (err) {
        return res.status(Http.BAD_REQUEST).json({ success: false, message: `${field} has wrong mime type` });
      }
      next();
    })
  };
};
