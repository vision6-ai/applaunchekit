const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const ExpoToken = require('../models/expoToken.model');

const createToken = async (user_id, token) => {
  const newToken = token.replace('ExponentPushToken[', '').replace(']', '');
  if (await ExpoToken.findOne({ user_device_id: `${user_id}_${newToken}` })) {
    return;
  }
  const result = await ExpoToken.create({ user_device_id: `${user_id}_${newToken}`, user_id, token: token });
  return result;
};

/**
 * Send push notification
 * @param {string} ExponentPushToken
 * @param {string} title
 * @param {string} body
 * @returns {Promise<Object>}
 */
const sendPushNotification = async (ExponentPushTokens, title, body) => {
  try {
    const messages = ExponentPushTokens.map((token) => ({
      to: token,
      sound: 'default',
      body: body,
      title: title,
    }));
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const data = await response.json();
    console.log('Push Notification Response:', data);
    return data;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send push notification');
  }
};

module.exports = {
  createToken,
  sendPushNotification,
};
