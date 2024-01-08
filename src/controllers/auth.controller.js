const httpStatus = require("http-status");
const { authService, tokenService, captchaService, userService } = require("../services");
const exclude = require('../utils/exclude');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const login = catchAsync(async (req, res) => {
  httpAuthCounter.inc("POST", "/login")
  const { account, password } = req.body;
  const user = await authService.login(account, password);
  const token = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: {access_token: token}, error: "" });
});

const signup = catchAsync(async (req, res) => {
  httpAuthCounter.inc("POST", "/signup")
  const data = { course, facebook, email, fullName, phone, reCaptchaRes } = req.body
  if(req.file){
    data["image"] = req.file.filename;
  }

  // const isSuccess = await captchaService.verify(req.headers['recaptcha'])
  // if(!isSuccess){
  //   throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "captcha not valid");
  // }

  let user = await userService.getUnique(phone, email, facebook)
  if(user){
    throw new ApiError(httpStatus.NOT_FOUND, "user already exists");
  }

  user = await authService.register(data);
  const userRes = exclude(user, ['password', 'createdAt', 'updatedAt', 'isCheckin', 'role', 'facebook', 'email', 'phone']);
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: "success", data: { user: userRes}, error: "" });
});

const adminSignupUser = catchAsync(async (req, res) => {
  const { course, facebook, email, fullName, phone } = req.body

  let user = await userService.getUnique(phone, email, facebook)
  if(user){
    throw new ApiError(httpStatus.NOT_FOUND, "user already exists");
  }

  user = await authService.register({ course, facebook, email, fullName, phone, isCheckin: true, checkinType: 'PhoneOrEmail' });
  const userRes = exclude(user, ['password', 'createdAt', 'updatedAt', 'isCheckin', 'role', 'facebook', 'email', 'phone']);
  _io.emit("user-checkin", {});
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: "success", data: { user: userRes}, error: "" });
});

const signupAdmin = catchAsync(async (req, res) => {
  httpAuthCounter.inc("POST", "/admin/signup")
  const data = { email, fullName, className, studentCode, password, phone } = req.body
  const user = await authService.registerAdmin(data);
  const userWithoutPassword = exclude(user, ['password', 'createdAt', 'updatedAt', 'isCheckin', 'role']);
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: "success", data: {user: userWithoutPassword}, error: "" });
});

module.exports = { login, signup, signupAdmin, adminSignupUser }