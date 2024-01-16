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
      name: true,
      index: true
    }
  }) 
}

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
      index
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
  getAll,
  updateById,
  deleteById
};