const httpStatus = require("http-status");
const prisma = require("../client");
const cache = require("../config/cache");
const ApiError = require("../utils/ApiError");

const create = async (notiBody) => {
  const { isLive, userId, videoId } = notiBody
  let content = ``
  if(!isLive){
    content = "đã tải lên: "
  } else {
    content = "đang phát trực tiếp: "
  }

  const subList = await prisma.subscription.findMany({
    where: {
      supUserId: userId
    }
  })

  const insertList = subList.map((s) => {
    const noti =  {
      userId: s.userId,
      videoId: videoId,
      content
    }

    _io.emit(`notification-${s.userId}`, {})
    return noti;
  })

  const noti = await prisma.notification.createMany({
    data: insertList,
  })

  if (!noti) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not create new noti");
  }

  return noti;
};

const getAll = async (userId) => {
  return prisma.notification.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      content: true,
      watched: true,
      updatedAt: true,
      video: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
          user: {
            select: {
              id: true,
              avatar: true,
              fullname: true
            }
          }
        }
      }
    },
    orderBy: {updatedAt: "desc"},
  }) 
}

const getById = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "category does not exist");
  }

  return category;
};

const updateById = async (id, data) => {
  const { watched } = data;
  
  const noti = await prisma.notification.findUnique({
    where: {
      id,
    },
  });
  
  if (!noti) {
    throw new ApiError(httpStatus.NOT_FOUND, "notification does not exist");
  }

  const updateNoti = await prisma.notification.update({
    where: {
      id,
    },
    data: {
      watched
    },
  });

  return updateNoti;
};

const deleteById = async (id) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "category does not exist");
  }
  
  return await prisma.category.delete({
    where: {
      id
    },
  })
}

module.exports = {
  create,
  getById,
  getAll,
  updateById,
};