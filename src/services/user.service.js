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

const getById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullname: true,
      avatar: true,
      gender: true,
      
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
  const { q, checkin } = filter;
  const page = parseInt(options.page ?? 1);
  const limit = parseInt(options.limit ?? 10);
  const sortBy = options.sortBy;

  const where = {
    role: Role.USER,
  };

  if (q) {
    where["OR"] = [
      { phone: q },
      { email: q },
      { fullName: { contains: q, mode: "insensitive" } },
    ];
  }

  if (checkin == 1) {
    where["isCheckin"] = true;
  }

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        fullname: true,
        email: true,
        avatar: true,
        isLock: true
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
    },
    select: {
      fullname: true,
      avatar: true,
      id: true,
      password: true
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

const lockUserById = async (id, isLock) => {
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
      isLock
    },
    select: {
      id: true,
      fullname: true,
      email: true,
      avatar: true,
      isLock: true
    },
  });

  return updateUser;
}

const deleteImage = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user.image) {
    throw new ApiError(httpStatus.BAD_REQUEST, "user has no photo");
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      acceptFace: false,
      image: null,
    },
  });
};

module.exports = {
  getById,
  getOne,
  getAll,
  getUnique,
  getUserByEmail,
  updateById,
  deleteImage,
  lockUserById
};
