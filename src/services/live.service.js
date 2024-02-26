const hexoid = require('hexoid')
const httpStatus = require("http-status");
const prisma = require("../client");
const cache = require("../config/cache");
const ApiError = require("../utils/ApiError");

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

const getByLiveKey = async(liveKey) => {
  return prisma.liveStream.findFirst({
    where: {
      liveKey
    },
    select: {
      id: true,
    },
  });
}

const updateById = async (id, {categoryId, title, desc, disableComment, isRecord}) => {
  const video = await prisma.video.findUnique({
    where: {
      id,
    },
    select: {
      livestream: true
    }
  });
  
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "live does not exist");
  }

  await prisma.liveStream.update({
    where: {
      id: video.livestream.id,
    },
    data: {
      isRecord
    }
  })

  const updateVideo = await prisma.video.update({
    where: {
      id,
    },
    data: {
      title,
      categoryId,
      desc,
      disableComment,
    },
  });

  return updateVideo;
}

const updateStatus = async (liveKey, status) => {
  await prisma.liveStream.updateMany({
    where: {
      liveKey: liveKey,
    },
    data: {
      status
    }
  })
}

module.exports = {
  create,
  getByLiveKey,
  updateById,
  updateStatus
};
