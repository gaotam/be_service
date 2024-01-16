const hexoid = require('hexoid')
const httpStatus = require("http-status");
const prisma = require("../client");
const cache = require("../config/cache");
const ApiError = require("../utils/ApiError");
const { Role } = require("@prisma/client");

const create = async (liveBody) => {
  const live = await prisma.liveStream.create({
    data: {
      ...liveBody,
      liveKey: `${hexoid(4)()}-${hexoid(4)()}-${hexoid(4)()}-${hexoid(4)()}`
    }
  })

  if (!live) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not create new live");
  }

  return live;
};

module.exports = {
  create
};
