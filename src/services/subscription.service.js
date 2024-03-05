const httpStatus = require("http-status");
const prisma = require("../client");
const cache = require("../config/cache");
const ApiError = require("../utils/ApiError");

const create = async (type, userId, subId) => {
  const sub = await prisma.subscription.findFirst({
    where: {
      userId,
      supUserId: subId
    },
  });
  
  if(type === "sub" && !sub) {
    return prisma.subscription.create({
      data: {
        userId,
        supUserId: subId
      }
    })
  } 

  if(type == "un_sub" && sub){
    return prisma.subscription.delete({
      where: {
        id: sub.id
      },
    })
  }
  
  return null;
};

const getAll = async (userId) => {
  return prisma.subscription.findMany({
    where: {
      userId
    },
  }) 
}

const getBySubId = async (userId, subId) => {
  const sub = await prisma.subscription.findFirst({
    where: {
      userId,
      supUserId: subId
    },
  });

  if (!sub) {
    throw new ApiError(httpStatus.NOT_FOUND, "sub does not exist");
  }

  return sub;
};

module.exports = {
  create,
  getAll,
  getBySubId
};