const jwt = require("jsonwebtoken");
const moment = require("moment");
const ApiError = require("../utils/ApiError");
const config = require('../config/config');

const tokenTypes = {
  ACCESS: "access",
  FACE: "face",
};

const generateToken = (userId, expires, type, secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const generateUpdateFaceToken = async (userId) => {
  const tokenExpires = moment().add(
    120,
    "minutes"
  );

  const token = generateToken(
    userId,
    tokenExpires,
    tokenTypes.FACE,
    config.jwt.secret
  );
  
  return token
}

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS,
    config.jwt.secret
  );

  return accessToken
};

const verifyToken = async (token, secret) => {
  const payload = jwt.verify(token, secret);
  const user = await userService.getUser(payload.sub);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not update user");
  }

  return payload;
};

module.exports = { generateAuthTokens, generateUpdateFaceToken }