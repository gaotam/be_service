const httpStatus = require("http-status");
const prisma = require("../client");
const cache = require("../config/cache");
const ApiError = require("../utils/ApiError");
const { Role } = require("@prisma/client");

const create = async (userId, videoId) => {
  const history = await prisma.history.create({
    data: {
      userId,
      videoId
    }
  })

  if (!history) {
    throw new ApiError(httpStatus.BAD_REQUEST, "can not create new history");
  }

  return history;
};

const getAll = async (filter, options) => {
  const { q, userId } = filter;
  const page = parseInt(options.page ?? 1);
  const limit = parseInt(options.limit ?? 10);
  const sortBy = options.sortBy;

  const where = {
    userId
  };

  if (q) {
    where["video"] = {
      title: {
        contains: q
      }
    }
  }

  const [users, total] = await prisma.$transaction([
    prisma.history.findMany({
      where,
      select: {
        id: true,
        user: {
          select: {
            id: true,
            fullname: true
          }
        },
        video: {
          select: {
            id: true,
            title: true,
            desc: true,
            thumbnail: true,
            createdAt: true,
            views: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: sortBy ? { [sortBy]: "desc" } : undefined,
    }),
    prisma.history.count({ where: where }),
  ]);

  return { users, total, page, limit };
};

const deleteByUserId = async (userId) => {  
  return await prisma.history.deleteMany({
    where: {
      userId
    },
  })
}

module.exports = {
  create,
  getAll,
  deleteByUserId
};
