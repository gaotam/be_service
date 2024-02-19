const httpStatus = require("http-status");
const { videoService, liveService, transcodeService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const exclude = require('../utils/exclude');

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
  videos = await videoService.getAll({}, {})
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: videos, error: "" });
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params
  video = await videoService.getById(id)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: video, error: "" });
})

const deleteById = catchAsync(async (req, res) => {
  const { id } = req.params
  video = await videoService.deleteById(id)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: { video: video }, error: "" });
});

module.exports = {
  create,
  getAll,
  getById,
  deleteById
};