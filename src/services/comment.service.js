const httpStatus = require("http-status");
const prisma = require("../client");
const cache = require("../config/cache");
const ApiError = require("../utils/ApiError");

const create = async (commentBody) => {
  const comment = await prisma.comment.create({
    data: commentBody
  })

  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not create new comment");
  }

  return comment;
};

const getAll = async (filter, options) => {
  const { videoId, userId } = filter;
  const page = parseInt(options.page ?? 1);
  const limit = parseInt(options.limit ?? 10);
  const sortBy = options.sortBy;

  const where = {
  };

  if(videoId){
    where["videoId"] = videoId
  }

  if(userId){
    where["userId"] = userId
  }

  const [comments, total] = await prisma.$transaction([
    prisma.comment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: sortBy ? { [sortBy]: "desc" } : undefined,
      select: {
        id: true,
        video: {
          select: {
            id: true,
            title: true,
            thumbnail: true
          }
        },
        content: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.comment.count({ where: where }),
  ]);

  return { comments, total, page, limit };
};

const updateById = async (id, content) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, "comment does not exist");
  }

  const updateComment = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      content
    },
  });

  return updateComment;
}


const deleteById = async (id) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: id,
    },
  });

  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "comment not exist");
  }

  await prisma.comment.delete({
    where: {
      id,
    }
  });
};

module.exports = {
  create,
  getAll,
  updateById,
  deleteById
};