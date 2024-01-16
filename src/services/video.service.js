const httpStatus = require("http-status");
const prisma = require("../client");
const cache = require("../config/cache");
const ApiError = require("../utils/ApiError");
const { Role } = require("@prisma/client");

const getOne = async (q) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ phone: q }, { email: q }],
    },
    select: {
      id: true,
      fullName: true,
      course: true,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }

  const success = cache.set(`user-${q}`, {
    id: user.id,
    fullName: user.fullName,
  });
  if (!success) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "server error");
  }
  return user;
};

const create = async (videoBody) => {
  const video = await prisma.video.create({
    data: videoBody
  })

  if (!video) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not create new video");
  }

  return video;
};


const getById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullName: true,
      course: true,
      email: true,
      phone: true,
      image: true,
      facebook: true,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }

  return user;
};

const getUnique = async (email) => {
  return prisma.user.findFirst({
    where: {
      email: email
    },
    select: {
      id: true,
    },
  });
};

const getAll = async (filter, options) => {
  // const { q, checkin } = filter;
  const page = parseInt(options.page ?? 1);
  const limit = parseInt(options.limit ?? 10);
  const sortBy = options.sortBy;

  const where = {
  };

  // if (q) {
  //   where["OR"] = [
  //     { phone: q },
  //     { email: q },
  //     { fullName: { contains: q, mode: "insensitive" } },
  //   ];
  // }

  // if (checkin == 1) {
  //   where["isCheckin"] = true;
  // }

  const [users, total] = await prisma.$transaction([
    prisma.video.findMany({
      where,
      select: {
        id: true,
        userId: true,
        category: true,
        title: true,
        desc: true,
        path: true,
        thumbnail: true,
        views: true,
        like: true,
        dislike: true,
        metadata: true,
        disableComment: true,
        isLive: true
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: sortBy ? { [sortBy]: "desc" } : undefined,
    }),
    prisma.user.count({ where: where }),
  ]);

  return { users, total, page, limit };
};

const getUserByEmail = async (email) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email
    }
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }

  return user;
};

const updateById = async (id, data) => {
  const { fullname, email, avatar, gender } = data;
  
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }

  const updateUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      fullname,
      email,
      avatar,
      gender
    },
    select: {
      id: true,
      fullname: true,
      email: true,
      avatar: true,
    },
  });

  return updateUser;
};

const deleteById = async (id) => {
  const video = await prisma.video.findUnique({
    where: {
      id: id,
    },
  });

  if (!video) {
    throw new ApiError(httpStatus.BAD_REQUEST, "video not exist");
  }

  await prisma.video.delete({
    where: {
      id,
    }
  });
};

module.exports = {
  create,
  getAll,
  deleteById
};
