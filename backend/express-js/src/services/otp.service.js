const twilio = require('twilio');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const {
  twilio: { accountSid, authToken, serviceId },
} = require('../config/config');

const client = twilio(accountSid, authToken);
const otpService = client.verify.v2.services(serviceId);

const sendOTP = async (phone) => {
  await otpService.verifications.create({
    to: phone,
    channel: 'sms',
  });
};

const verifyOTP = async (phone, code) => {
  const data = await otpService.verificationChecks.create({
    to: phone,
    code: code,
  });
  if (!data.valid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect OTP');
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};
