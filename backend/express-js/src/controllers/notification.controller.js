const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');
const { ExpoToken } = require('../models');

const createToken = catchAsync(async (req, res) => {
  const { user_id, token } = req.body;
  const result = await notificationService.createToken(user_id, token);
  res.status(httpStatus.OK).send(result);
});

const sendPushNotification = catchAsync(async (req, res) => {
  const { user_id, title, body } = req.body;
  const ExpoTokenData = await ExpoToken.find({ user_id });
  const expoTokens = ExpoTokenData.map((token) => token.token);
  const result = await notificationService.sendPushNotification(expoTokens, title, body);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  createToken,
  sendPushNotification,
};
