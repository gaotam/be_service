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

module.exports = {
  create
};