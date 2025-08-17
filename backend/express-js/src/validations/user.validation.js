const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      first_name: Joi.string(),
      last_name: Joi.string().allow(''),
      profile_image_url: Joi.string().allow('').allow(null),
      cover_image_url: Joi.string().allow('').allow(null),
      phone_number: Joi.string()
        .pattern(/^\d{10}$/)
        .allow('')
        .allow(null),
      gender: Joi.string().valid('Male', 'Female', 'Other').required(),
      city: Joi.string().allow(''),
      state: Joi.string().allow(''),
      country: Joi.string().allow(''),
      zipcode: Joi.string()
        .pattern(/^\d{6}$/)
        .allow(''),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
