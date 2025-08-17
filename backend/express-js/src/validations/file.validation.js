const Joi = require('joi');

const uploadFile = {
  body: Joi.object().keys({
    bucketName: Joi.string().valid('cover_images', 'profile_images').required(),
    fileData: Joi.string()
      .pattern(/^data:image\/\w+;base64,/)
      .required(),
  }),
};

const removeFile = {
  body: Joi.object().keys({
    bucketName: Joi.string().valid('cover_images', 'profile_images').required(),
    fileUrl: Joi.string().uri().required(),
  }),
};

module.exports = {
  uploadFile,
  removeFile,
};
