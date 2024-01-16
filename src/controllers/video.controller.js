const httpStatus = require("http-status");
const cache = require('../config/cache')
const { videoService, liveService } = require("../services");

const catchAsync = require("../utils/catchAsync");
const pick = require('../utils/pick');
const exclude = require('../utils/exclude');
const ApiError = require("../utils/ApiError");

const create = catchAsync(async (req, res) => {
  const data = { categoryId, title, desc, isLive, disableComment } = req.body
  const userId = req.user.id
  data.isLive = isLive === "true"

  if(req.file){
    data["thumbnail"] = `/thumbnail/${req.file.filename}`;
  }

  if (data.isLive) {
    const live = await liveService.create({})
    data.livestreamId = live.id
  }
  data.disableComment = disableComment === "true"
  let video = await videoService.create({...data, userId: userId})
  const videoRes = exclude(video, ['password']);
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: "success", data: { video: videoRes}, error: "" });
});

const getAll = catchAsync(async (req, res) => {
  videos = await videoService.getAll({}, {})
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: { videos: videos }, error: "" });
});

const deleteById = catchAsync(async (req, res) => {
  const { id } = req.params
  video = await videoService.deleteById(id)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: { video: video }, error: "" });
});

module.exports = {
  create,
  getAll,
  deleteById
};