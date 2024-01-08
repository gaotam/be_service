const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const userService = require("./user.service");
const { encryptPassword } = require('../utils/encryption');
const ApiError = require("../utils/ApiError");
const prisma = require("../client");


const login = async (account, password) => {
  const user = await userService.getUserByAccount(account);

  if(user.role != 'ADMIN'){
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "this account is invalid"
    );
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "user account or password incorrect"
    );
  }

  return user;
};

const register = async (userBody) => {
  delete userBody.reCaptchaRes
  const user = await prisma.user.create({
    data: {...userBody}
  })

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not create new user");
  }

  return user;
};

const registerAdmin = async (userBody) => {
  const user = await prisma.user.create({
    data: {...userBody, password: await encryptPassword(userBody.password), role: 'ADMIN'}
  })

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not create new user");
  }

  return user;
};
module.exports = { login, register, registerAdmin }