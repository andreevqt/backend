'use strict';

const sharp = require('sharp');
const path = require('path');
const config = require('../../config');

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

const generateThumbnail = async (file, dimension) => {
  const { width, height } = await getDimensions(file.buffer);
  if (width > dimension.width || height > dimension.height) {
    const name = `thumbnail_${dimension.width}x${dimension.height}_${file.name}`;
    const res = await resizeTo(file.buffer, name, dimension);
    if (res) {
      const { width, height, size } = res;
      return {
        name,
        mimetype: file.mimetype,
        width,
        height,
        size: bytesToKbytes(size),
        url: `${uploadUrl}/${name}`
      };
    }
  }
};

module.exports.process = async (file, formatsToGenerate = {}) => {
  if (!file) {
    return;
  }

  const { width, height, size } = await getMeta(file.buffer);
  const { mimetype } = file;
  const ext = getExt(file);

  const name = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
  const url = `${uploadUrl}/${name}`;

  await sharp(file.buffer).toFile(`${uploadPath}/${name}`);

  file.name = name;
  file.path = uploadPath;
  file.ext = ext;

  const formats = {};
  await Promise.all(Object.keys(formatsToGenerate).map(async (format) => {
    const result = await generateThumbnail(file, formatsToGenerate[format]);
    formats[format] = result;
  }));

  return {
    name,
    url,
    width,
    height,
    size: bytesToKbytes(size),
    mimetype,
    formats
  };
};
