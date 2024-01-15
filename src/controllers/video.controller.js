const httpStatus = require("http-status");
const cache = require('../config/cache')
const { videoService, liveService } = require("../services");

const catchAsync = require("../utils/catchAsync");
const pick = require('../utils/pick');
const exclude = require('../utils/exclude');
const ApiError = require("../utils/ApiError");

const create = catchAsync(async (req, res) => {
  const data = { categoryId, title, desc, isLive } = req.body
  const userId = req.user.id
  isLive = isLive === "true"

  if (isLive) {
    const live = liveService.create({})
    data.livestreamId = live.id
  }
  let video = await videoService.create({...data, userId: userId, isLive: isLive})
  const videoRes = exclude(video, ['password']);
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: "success", data: { video: videoRes}, error: "" });
});

module.exports = {
  create
};