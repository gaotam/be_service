const httpStatus = require("http-status");
const { videoService, liveService, transcodeService, historyService, catergoryService } = require("../services");
const pick = require('../utils/pick');
const catchAsync = require("../utils/catchAsync");
const exclude = require('../utils/exclude');
const ApiError = require("../utils/ApiError");

const create = catchAsync(async (req, res) => {
  let live = null
  const data = { categoryId, title, desc, isLive, disableComment } = req.body
  const userId = req.user.id
  data.isLive = isLive === "true"

  if(isLive && !req.files?.video && req.files?.video.length == 0){
    return res.status(httpStatus.BAD_REQUEST).send({ code: httpStatus.BAD_REQUEST, message: "", data: null, error: "video is required" });
  }

  if(req.files?.thumbnail[0]){
    data["thumbnail"] = `/thumbnails/${req.files?.thumbnail[0].filename}`;
  }

  if(isLive && req.files?.video && req.files?.video.length > 0){
    data["src"] = `/videos/${req.files?.video[0].filename}`;
  }
  
  if (data.isLive) {
    live = await liveService.create({})
    data.livestreamId = live.id
  }

  data.disableComment = disableComment === "true"
  let video = await videoService.create({...data, userId: userId})
  if (!video.isLive){
    await transcodeService.startTranscodeVideo(video.id)
  } 
  
  const videoRes = exclude(video, ['password']);
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: "success", data: { video: videoRes}, error: "" });
});

const getAll = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['q', 'createdAt', 'duration']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  videos = await videoService.getAll(filter, options)
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
  const video = await videoService.getVideoTrending()
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: video, error: "" });
});

module.exports = {
  create,
  getAll,
  getById,
  deleteById,
  getVideoTrending,
  category
};