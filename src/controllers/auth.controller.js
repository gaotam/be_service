const httpStatus = require("http-status");
const { authService, tokenService, captchaService, userService } = require("../services");
const exclude = require('../utils/exclude');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const login = catchAsync(async (req, res) => {
  const { account, password } = req.body;
  const user = await authService.login(account, password);
  const token = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: {access_token: token}, error: "" });
});

const signup = catchAsync(async (req, res) => {
  const data = { fullname, password, gender, email } = req.body
  let user = await userService.getUnique(email)
  if(user){
    throw new ApiError(httpStatus.NOT_FOUND, "user already exists");
  }
  user = await authService.register(data);
  const userRes = exclude(user, ['password']);
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: "success", data: { user: userRes}, error: "" });
});

module.exports = { login, signup}