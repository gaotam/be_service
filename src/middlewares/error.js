const httpStatus = require('http-status');
const { Prisma } = require('@prisma/client');

const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const handlePrismaError = (err) => {
  switch (err.code) {
    case 'P2002':
      return new ApiError(400, `duplicate field value: ${err.meta.target}`);
    case 'P2014':
      return new ApiError(400, `invalid ID: ${err.meta.target}`);
    case 'P2003':
      return new ApiError(400, `invalid input data: ${err.meta.target}`);
    default:
      return new ApiError(500, `something went wrong: ${err.message}`);
  }
};

const errorConverter = (err, req, res, next) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR
  let message = err.message

  if(err instanceof Prisma.PrismaClientKnownRequestError){
    err = handlePrismaError(err)
  }

  if(err instanceof ApiError){
    return next(err)
  }

  if(err.name === "TokenExpiredError" || err.name === 'JsonWebTokenError'){
    statusCode = httpStatus.UNAUTHORIZED
    message = "invalid token"
  }

  const error = new ApiError(statusCode, message, false, err.stack);

  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // if (config.env === 'production' && !err.isOperational) {
  //   statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  //   message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  // }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    console.log(err);
    logger.error(err, { label: "errorHandler" });
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
