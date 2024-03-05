const httpStatus = require("http-status");
const prisma = require("../client");
const cache = require("../config/cache");
const ApiError = require("../utils/ApiError");

const create = async (notiBody) => {
  const { isLive } = notiBody
  let content = ``
  if(!isLive){
    content = "đã tải lên: "
  } else {
    content = "đang phát trực tiếp: "
  }

  notiBody.content = content
  delete notiBody.isLive

  const noti = await prisma.notification.create({
    data: notiBody,
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
    }
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

const getByName = async (name) => {
  if(name == "music"){
    name = "Âm nhạc"
  }
  else if(name == "game"){
    name = "Trò chơi"
  }
  
  const category = await prisma.category.findFirst({
    where: {
      name
    },
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "category does not exist");
  }

  return category;
};

const updateById = async (id, data) => {
  const { name, index } = data;
  
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "category does not exist");
  }

  const updateCategory = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      index: parseInt(index)
    },
    select: {
      name: true,
      index: true
    },
  });

  return updateCategory;
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
  getByName,
  updateById,
  deleteById
};