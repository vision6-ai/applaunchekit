const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, otpService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken, req.body.redirectTo);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendOTP = catchAsync(async (req, res) => {
  const { phone_number } = req.body;
  await otpService.sendOTP(phone_number);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyOTP = catchAsync(async (req, res) => {
  const { phone_number, otp } = req.body;
  await otpService.verifyOTP(phone_number, otp);
  const user = await authService.loginUserWithPhone(phone_number);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const googleCallback = catchAsync(async (req, res) => {
  const { user, tokens } = req.user;

  const data = {
    user: {
      id: user._id,
      email: user.email,
    },
    access_token: tokens.access.token,
    access_token_expires: new Date(tokens.access.expires).getTime(),
    refresh_token: tokens.refresh.token,
    refresh_token_expires: new Date(tokens.refresh.expires).getTime(),
  };

  res.redirect(`http://localhost:8081/?data=${encodeURIComponent(JSON.stringify(data))}`);

  // To decode this in the frontend:
  // 1. Extract the 'data' query parameter from the URL
  // 2. Use decodeURIComponent to decode the URL-encoded string
  // 3. Parse the JSON string to get the original object
  //
  // Example frontend code:
  // const urlParams = new URLSearchParams(window.location.search);
  // const encodedData = urlParams.get('data');
  // const decodedData = decodeURIComponent(encodedData);
  // const authData = JSON.parse(decodedData);
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  sendOTP,
  verifyOTP,
  googleCallback,
};
