const Joi = require('joi');

const createToken = {
  body: Joi.object().keys({
    user_id: Joi.string().required(),
    token: Joi.string().required(),
  }),
};

const sendNotifications = {
  body: Joi.object().keys({
    user_id: Joi.string().required(),
    title: Joi.string().required(),
    body: Joi.string().required(),
  }),
};

module.exports = {
  createToken,
  sendNotifications,
};
