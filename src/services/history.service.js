const httpStatus = require("http-status");
const prisma = require("../client");
const cache = require("../config/cache");
const ApiError = require("../utils/ApiError");
const { Role } = require("@prisma/client");

const create = async (userId, videoId) => {
  let history = await prisma.history.findFirst({
    where: {
      userId,
      videoId
    }
  })

  if(history) {
    return history;
  }

  const historyCreated = await prisma.history.create({
    data: {
      userId,
      videoId
    }
  })

  if (!historyCreated) {
    throw new ApiError(httpStatus.BAD_REQUEST, "can not create new history");
  }

  return historyCreated;
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

  const [history, total] = await prisma.$transaction([
    prisma.history.findMany({
      where,
      select: {
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
            views: true,
            duration: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: sortBy ? { [sortBy]: "desc" } : undefined,
    }),
    prisma.history.count({ where: where }),
  ]);

  return { history, total, page, limit };
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
