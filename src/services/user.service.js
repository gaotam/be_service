const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const { aiURL } = require("../config/config");
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

const getUnique = async (phone, email, facebook) => {
  return prisma.user.findFirst({
    where: {
      OR: [{ phone: phone }, { email: email }, { facebook: facebook }],
    },
    select: {
      id: true,
      fullName: true,
      course: true,
      email: true,
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
        fullName: true,
        email: true,
        phone: true,
        image: true,
        isCheckin: true,
        acceptFace: true,
        course: true,
        facebook: true,
        checkinType: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: sortBy ? { [sortBy]: "desc" } : undefined,
    }),
    prisma.user.count({ where: where }),
  ]);

  return { users, total, page, limit };
};

const getUserByAccount = async (account) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ phone: account }, { email: account }],
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }

  return user;
};

const checkInQR = async (userId) => {
  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isCheckin: true,
      checkinType: "QR",
    },
  });

  if (updateUser.count == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
};

const checkInByPhoneOrEmail = async (q) => {
  const updateUser = await prisma.user.updateMany({
    where: {
      OR: [{ phone: q }, { email: q }],
    },
    data: {
      isCheckin: true,
      checkinType: "PhoneOrEmail",
    },
  });

  if (updateUser.count == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ phone: q }, { email: q }],
    },
  });
  return user;
};

const checkInByFace = async (phone) => {
  const updateUser = await prisma.user.update({
    where: {
      phone,
    },
    data: {
      isCheckin: true,
      checkinType: "Face",
    },
  });

  if (updateUser.count == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }

  const user = await prisma.user.findUnique({
    where: {
      phone,
    },
  });
  return user;
};

const updateById = async (id, data) => {
  const { fullName, email, phone, course, facebook, image } = data;

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
      fullName,
      email,
      phone,
      course,
      facebook,
      image,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      image: true,
      isCheckin: true,
      acceptFace: true,
      course: true,
      facebook: true,
    },
  });

  return updateUser;
};

const photoCensorship = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }

  if (!user.image) {
    throw new ApiError(httpStatus.BAD_REQUEST, "user has no photo");
  }

  if (user.acceptFace) {
    throw new ApiError(httpStatus.BAD_REQUEST, "this user has been approved");
  }

  const form = new FormData();
  form.append("name", user.fullName);
  form.append("phone", user.phone);
  form.append("course", user.course);
  const file = await fs.readFile(
    path.join(__dirname, `../uploads/${user.image}`)
  );
  form.append("img", file, user.image);

  const response = await axios.post(`${aiURL}/add-new`, form, {
    headers: {
      ...form.getHeaders(),
    },
  });

  if (!response.data.valid) {
    throw new ApiError(httpStatus.BAD_REQUEST, "invalid photo");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      acceptFace: true,
    },
  });
};

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
  getUserByAccount,
  updateById,
  checkInQR,
  checkInByPhoneOrEmail,
  checkInByFace,
  photoCensorship,
  deleteImage,
};
