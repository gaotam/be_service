const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const prisma = require('../client');
const cache = require('../config/cache')

const protect = catchAsync(async (req, res, next) => {
  let token = null;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } 
   
  if (!token) {
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, "token is required")
    );
  }

  const decodedToken = jwt.verify(token, config.jwt.secret);
  const { sub: userId } = decodedToken;

  const userCached = cache.get(`user-${userId}`);
  if(userCached){
    req.user = userCached;
    return next();
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "invalid token");
  }
  
  req.user = user;
  cache.set(`user-${userId}`, user)
  return next();
});

const protectSocket = (async(socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, "token is required")
      );
    }
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const { sub: userId } = decodedToken;

    const userCached = cache.get(`user-${userId}`);
    if(userCached){
      return next();
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    
    if (!user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, "invalid token"));
    }

    next()
  } catch (error) {
    next(error)
  }
})

const authorize = (role) => async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id
    }
  });

  if (user.role === role) return next();

  next(new ApiError(httpStatus.FORBIDDEN, 'forbidden'));
};

const secret = (req, res, next) => {
  const { secret } = req.query
  if(!secret || secret != config.secretAPI){
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Server error"
    );
  }

  next()
}

module.exports = { protect, protectSocket, authorize, secret }