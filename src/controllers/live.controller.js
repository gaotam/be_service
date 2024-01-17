const httpStatus = require("http-status");
const { liveService } = require("../services");
const exclude = require('../utils/exclude');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const onConnect = catchAsync(async (req, res) => {
  if (req.body.app != "live"){
    throw new ApiError(httpStatus.BAD_REQUEST, "app not found");
  }
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const onPlay = catchAsync(async (req, res) => {
  console.log("on_play ", req.body);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const onPublish = catchAsync(async (req, res) => {
  const live = await liveService.getByLiveKey(req.body.name)
  if (!live){
    throw new ApiError(httpStatus.BAD_REQUEST, "live key not found");
  }
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const onDone = catchAsync(async (req, res) => {
  console.log("on_done ", req.body);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const onPlayDone = catchAsync(async (req, res) => {
  console.log("on_play_done ", req.body);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const onPublishDone = catchAsync(async (req, res) => {
  console.log("on_publish_done ", req.body);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const onRecordDone = catchAsync(async (req, res) => {
  console.log("on_record_done ", req.body);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

module.exports = { onConnect, onPlay, onPublish, onDone, onPlayDone, onPublishDone, onRecordDone }