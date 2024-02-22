const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const userService = require("./user.service");
const { encryptPassword } = require('../utils/encryption');
const ApiError = require("../utils/ApiError");
const prisma = require("../client");

const login = async (email, password) => {
  const user = await userService.getUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "user account or password incorrect"
    );
  }
  
  if(user.isLock){
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "user is locked"
    );
  }

  delete user.password
  return user;
};

const register = async (userBody) => {
  const user = await prisma.user.create({
    data: {...userBody, password: await encryptPassword(userBody.password)}
  })

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not create new user");
  }

  return user;
};

module.exports = { login, register }