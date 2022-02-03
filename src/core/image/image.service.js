'use strict';

// taken from strapi image-manipulation

const sharp = require('sharp');
const path = require('path');
const config = require('../../config');

const thumbnailSizes = {
  width: 245,
  height: 156,
  fit: 'inside'
};

const uploadPath = path.resolve(__dirname, '../../public/uploads');
const uploadUrl = `${config.get('app.fullUrl')}/uploads`;

const bytesToKbytes = bytes => Math.round((bytes / 1000) * 100) / 100;

const getExt = (file) => {
  return path.extname(file.originalname);
};

const getMeta = (src) => sharp(src)
  .metadata()
  .catch(() => ({}));

const getDimensions = (src) => getMeta(src)
  .then(({ width = null, height = null }) => ({ width, height }))
  .catch(() => ({}));

const resizeTo = (buffer, name, options) => sharp(buffer)
  .resize(options)
  .toFile(`${uploadPath}/${name}`)
  .catch(() => null);

const generateThumbnail = async (file) => {
  const { width, height } = await getDimensions(file.buffer);
  if (width > thumbnailSizes.width || height > thumbnailSizes.height) {
    const name = `thumbnail_${file.name}`;
    const res = await resizeTo(file.buffer, `${name}${file.ext}`, thumbnailSizes);
    if (res) {
      const { width, height, size } = res;
      return {
        name,
        path: file.path,
        ext: file.ext,
        width,
        height,
        size: bytesToKbytes(size),
        url: `${uploadUrl}/${name}`,
        mimetype: file.mimetype
      };
    }
  }
};

module.exports.process = async (file) => {
  const { width, height, size } = await getMeta(file.buffer);
  const { mimetype } = file;
  const ext = getExt(file);

  const name = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
  const url = `${uploadUrl}/${name}${ext}`;

  await sharp(file.buffer).toFile(`${uploadPath}/${name}${ext}`);

  file.name = name;
  file.path = uploadPath;
  file.ext = ext;

  const thumbnail = await generateThumbnail(file);

  return {
    url,
    width,
    height,
    size: bytesToKbytes(size),
    name,
    path: uploadPath,
    ext,
    mimetype,
    formats: {
      thumbnail
    }
  };
};
