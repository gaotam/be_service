const httpStatus = require("http-status");
const { videoService, commentService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const exclude = require('../utils/exclude');

const create = catchAsync(async (req, res) => {
  const data = { videoId, comment } = req.body
  const userId = req.user.id

  const video = await videoService.getById(videoId)
  if(video.disableComment){
    return res.status(httpStatus.BAD_REQUEST).send({ code: httpStatus.BAD_REQUEST, message: "error", data: null, error: "commenting function has been disabled" });
  }

  await commentService.create({...data, userId: userId})

  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: "success", data: null, error: "" });
})

const getAll = catchAsync(async (req, res) => {
  const { videoId, page, limit } = req.query
  if(!videoId){
    return res.status(httpStatus.BAD_REQUEST).send({ code: httpStatus.BAD_REQUEST, message: "error", data: null, error: "videoId is required" });
  }
  const comments = await commentService.getAll({ videoId }, { page, limit })
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: comments, error: "" });
})

const getAllMe = catchAsync(async (req, res) => {
  const { page, limit } = req.query
  const userId = req.user.id;
  const comments = await commentService.getAll({ userId }, { page, limit })
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: comments, error: "" });
})

const updateById = catchAsync(async (req, res) => {
  const { id } = req.params
  const { content } = req.body
  await commentService.updateById(id, content)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
})

const deleteById = catchAsync(async (req, res) => {
  const { id } = req.params
  await commentService.deleteById(id)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
})

module.exports = {
  create,
  getAll,
  getAllMe,
  updateById,
  deleteById,
};