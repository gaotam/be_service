const httpStatus = require("http-status");
const { videoService, transcodeService, historyService, catergoryService, notificationService} = require("../services");
const { getDuration } = require("../utils/ffmpeg");

const pick = require('../utils/pick');
const catchAsync = require("../utils/catchAsync");
const exclude = require('../utils/exclude');
const ApiError = require("../utils/ApiError");

const create = catchAsync(async (req, res) => {
  const data = { categoryId, title, desc, disableComment } = req.body
  const userId = req.user.id

  await catergoryService.getById(categoryId)

  if(!req.files?.video && req.files?.video.length == 0){
    return res.status(httpStatus.BAD_REQUEST).send({ code: httpStatus.BAD_REQUEST, message: "", data: null, error: "video is required" });
  }

  if(req.files?.thumbnail[0]){
    data["thumbnail"] = `/thumbnails/${req.files?.thumbnail[0].filename}`;
  }

  if(req.files?.video && req.files?.video.length > 0){
    data["src"] = `/videos/${req.files?.video[0].filename}`;
  }
  
  data["duration"] = await getDuration(process.env.PATH_UPLOAD+data["src"])
  data.disableComment = disableComment === "true"
  let video = await videoService.create({...data, userId: userId})
  // await transcodeService.startTranscodeVideo(video.id)
  await notificationService.create({
    userId,
    videoId: video.id,
    isLive: video.isLive
  })

  const videoRes = exclude(video, ['password']);
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: "success", data: { video: videoRes}, error: "" });
});

const getAll = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['q', 'createdAt', 'duration']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  videos = await videoService.getAll({...filter, isLive: false}, options)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: videos, error: "" });
});

const getAllById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const filter = pick(req.query, ['q', 'createdAt', 'duration']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const videos = await videoService.getAll({...filter, userId: id}, options)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: videos, error: "" });
});

const getAllMe = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['q', 'createdAt', 'duration']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const videos = await videoService.getAll({...filter, userId: req.user.id}, options)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: videos, error: "" });
});

const category = catchAsync(async (req, res) => {
  const { name } = req.params
  const { type } = req.query
  if(name != "music" && name != "game"){
    throw new ApiError(httpStatus.BAD_REQUEST, "category not valid");
  }

  const { id } = await catergoryService.getByName(name)
  const videos = await videoService.getVideoByType(type, id);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: videos, error: "" });
})

const getById = catchAsync(async (req, res) => {
  const { id } = req.params

  if(req.user){
    await historyService.create(req.user.id, id);
  }
  const video = await videoService.getById(id)
  await videoService.upViews(id, 1);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: video, error: "" });
})

const deleteById = catchAsync(async (req, res) => {
  const { id } = req.params
  await videoService.deleteById(id)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const getVideoTrending = catchAsync(async (req, res) => {
  const { type } = req.query
  const video = await videoService.getVideoTrending(type)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: video, error: "" });
});

const updateById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = { title, desc, categoryId, disableComment } = req.body

  if(categoryId){
    await catergoryService.getById(categoryId)
  }

  if(req.files?.thumbnail){
    data["thumbnail"] = `/thumbnails/${req.files?.thumbnail[0].filename}`;
  }

  if(req.files?.video && req.files?.video.length > 0){
    data["src"] = `/videos/${req.files?.video[0].filename}`;
  // await transcodeService.startTranscodeVideo(video.id)
  }

  data.disableComment = disableComment === "true"
  const video = await videoService.updateById(id, data)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: video, error: null });
})

module.exports = {
  create,
  getAll,
  getAllById,
  getAllMe,
  getById,
  updateById,
  deleteById,
  getVideoTrending,
  category
};