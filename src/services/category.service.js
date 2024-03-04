const httpStatus = require("http-status");
const prisma = require("../client");
const cache = require("../config/cache");
const ApiError = require("../utils/ApiError");

const create = async (categoryBody) => {
  const category = await prisma.category.create({
    data: categoryBody
  })

  if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not create new category");
  }

  return category;
};

const getAll = async () => {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
      index: true
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