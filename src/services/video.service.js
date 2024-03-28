const httpStatus = require("http-status");
const prisma = require("../client");
const cache = require("../config/cache");
const ApiError = require("../utils/ApiError");
const categoryService = require("./category.service")

const getOne = async (q) => {

};

const create = async (videoBody) => {
  const video = await prisma.video.create({
    data: videoBody,
    select: {
      id: true,
      title: true,
      desc: true,
      user: {
        select: {
          id: true,
          fullname: true
        }
      },
      category: {
        select: {
          id: true,
          name: true
        }
      },
      isLive: true,
      livestream: true,
      views: true,
      disableComment: true,
    }
  })

  if (!video) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not create new video");
  }

  return video;
};

const getById = async (videoId) => {
  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
    select: {
      id: true,
      category: true,
      user: {
        select: {
          id: true,
          fullname: true,
          avatar: true
        }
      },
      isLive: true,
      livestream: true,
      desc: true,
      createdAt: true,
      thumbnail: true,
      duration: true,
      title: true,
      views: true,
      srcTranscode: true,
      createdAt: true,
      disableComment: true,
    },
  });

  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "video does not exist");
  }

  return video;
};

const getAll = async (filter, options) => {
  const { q, createdAt, duration, userId, isLive, categoryId, status } = filter;
  const page = Math.max(parseInt(options.page) || 1, 1);
  const limit = parseInt(options.limit ?? 10);
  const sortBy = options.sortBy;

  const where = {
  };

  if (userId) {
    where["userId"] = userId
  }

  if(status){
    where["livestream"] = {
      status
    }
  }

  if (categoryId) {
    where["categoryId"] = categoryId
  }

  if (isLive != undefined) {
    where["isLive"] = isLive
  }

  if (q) {
    where["title"] = {
      contains: q
    }
  }

  if(duration){
    if(duration == 1){
      where["duration"] = {
        lt: 240
      }
    } else if(duration == 2){
      where["duration"] = {
        gte: 240,
        lte: 1200
      }
    } else {
      where["duration"] = {
        gt: 1200,
      }
    }
  }

  if(createdAt){
    if(createdAt == "h"){
      where["createdAt"] = {
        gte: new Date(Date.now() - 60 * 60 * 1000),
      }
    } else if(createdAt == "today") {
      where["createdAt"] = {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      }
    } else if(createdAt == "w") {
      where["createdAt"] = {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      }
    } else if(createdAt == "m") {
      where["createdAt"] = {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      }
    } else if(createdAt == "y") {
      where["createdAt"] = {
        gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      }
    }
  }
  const [videos, total] = await prisma.$transaction([
    prisma.video.findMany({
      where,
      select: {
        id: true,
        user: {
          select: {
            id: true,
            fullname: true,
            avatar: true,
          }
        },
        livestream: {
          select: {
            status: true,
            liveKey: true
          }
        },
        category: true,
        title: true,
        desc: true,
        src: true,
        srcTranscode: true,
        thumbnail: true,
        views: true,
        metadata: true,
        duration: true,
        disableComment: true,
        isLive: true,
        duration: true,
        createdAt: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: sortBy ? { [sortBy]: "desc" } : undefined,
    }),
    prisma.video.count({ where: where }),
  ]);

  return { videos, total, page, limit };
};

const getVideoByType = async(type, categoryId) => {
  let query = {
    select: {
      id: true,
      user: {
        select: {
          id: true,
          fullname: true,
          avatar: true,
        }
      },
      category: true,
      title: true,
      desc: true,
      src: true,
      thumbnail: true,
      duration: true,
      views: true,
      metadata: true,
      disableComment: true,
      isLive: true,
      createdAt: true,
    },
    take: 50
  }
  if(type == "trending"){
    query = {
      ...query,
      where: {
        categoryId: categoryId,
        createdAt: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: [
        {
          views: "desc",
        },
        {
          like: "desc"
        }
      ],
    }
  } else if(type == "new"){
    query = {
      ...query,
      where: {
        categoryId: categoryId
      },
      orderBy: [
        {
          createdAt: "desc",
        }
      ],
    }
  } else if(type == "propose"){
    const videos = await prisma.$queryRawUnsafe(
      `
      SELECT *
      FROM "videos" 
      INNER JOIN categories ON videos."categoryId" = categories.id 
      INNER JOIN users ON users."id" = videos."userId"
      ORDER BY RANDOM() 
      LIMIT 50;`,
    )

    return videos.map(v => {
      return {
        id: v.id,
        title: v.title,
        user: {
          id: v.userId,
          fullname: v.fullname,
          avatar: v.avatar
        },
        category: {
          id: v.categoryId,
          index: v.index,
          name: v.name
        },
        title: v.title,
        desc: v.desc,
        src: v.src,
        duration: v.duration,
        thumbnail: v.thumbnail,
        views: v.views,
        createdAt: v.createdAt
      }
    })
  }

  return prisma.video.findMany(query);
}

const updateById = async (id, data) => {
  const { title, desc, categoryId, disableComment, thumbnail, src, views } = data;
  
  const video1 = await prisma.video.findUnique({
    where: {
      id,
    },
  });
  
  if (!video1) {
    throw new ApiError(httpStatus.NOT_FOUND, "video does not exist");
  }

  const updateVideo = await prisma.video.update({
    where: {
      id,
    },
    data: {
      title,
      desc,
      categoryId,
      disableComment,
      thumbnail,
      src,
      views
    },
    select: {
      id: true,
      category: true,
      user: {
        select: {
          id: true,
          fullname: true,
          avatar: true
        }
      },
      livestream: true,
      desc: true,
      createdAt: true,
      thumbnail: true,
      title: true,
      views: true,
      srcTranscode: true,
      createdAt: true,
      disableComment: true,
    },
  });

  return updateVideo;
};

const upViews = async(id, count) => {
  const video = await prisma.video.findUnique({
    where: {
      id,
    },
  });
  
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "video does not exist");
  }

  await prisma.video.update({
    where: {
      id,
    },
    data: {
      views: {
        increment: count
      }
    },
  });
}

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

const getVideoTrending = async (type) => {
  let where = {
    createdAt: {
      gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    isLive: false,
  }
  if(type == "music"){
    const { id } = await categoryService.getByName("Âm nhạc")
    where["categoryId"] = id
  } else if(type == "game"){
    const { id } = await categoryService.getByName("Trò chơi")
    where["categoryId"] = id
  } else if(type == "film"){
    const { id } = await categoryService.getByName("Phim ảnh")
    where["categoryId"] = id
  }

  const video = await prisma.video.findMany({
    where,
    orderBy: [
      {
        views: "desc",
      },
      {
        like: "desc"
      }
    ],
    take: 20,
    select: {
      id: true,
      title: true,
      thumbnail: true,
      views: true,
      desc: true,
      createdAt: true,
      duration: true,
      category: {
        select: {
          id: true,
          name: true
        }
      },
      user: {
        select: {
          id: true,
          fullname: true
        }
      }
    }
  })

  return video
}

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
  upViews,
  getVideoTrending,
  getVideoByType
};
