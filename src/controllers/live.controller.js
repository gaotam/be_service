const httpStatus = require("http-status");
const { liveService, transcodeService } = require("../services");
const exclude = require('../utils/exclude');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const onConnect = catchAsync(async (req, res) => {
  let {app: liveKey, swfurl} = req.body
  const apps = ["live", "nr_live", "t_live"]
  if(Array.isArray(liveKey)){
    liveKey = liveKey[0]
  }

  if(!apps.includes(liveKey) && swfurl != ""){
    throw new ApiError(httpStatus.BAD_REQUEST, "app not found");
  }

  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const onPlay = catchAsync(async (req, res) => {
  let { token, secret } = req.body
  console.log(req.body);
  if(secret && secret == process.env.SECRET_TRANSCODE){
    return res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
  }

  // if(!token){
  //   throw new ApiError(httpStatus.BAD_REQUEST, "token not valid");
  // }
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const onPublish = catchAsync(async (req, res) => {
  const {name, app} = req.body
  const liveKey = name.split("_")[0]
  const live = await liveService.getByLiveKey(liveKey)
  if (!live){
    throw new ApiError(httpStatus.BAD_REQUEST, "live key not found");
  }

  if(app === "live" || app === "nr_live"){
    await transcodeService.startTranscodeLive(liveKey)
  }
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const onDone = catchAsync(async (req, res) => {
  // console.log("on_done ", req.body);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const onPlayDone = catchAsync(async (req, res) => {
  // console.log("on_play_done ", req.body);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const onPublishDone = catchAsync(async (req, res) => {
  // console.log("on_publish_done ", req.body);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const onRecordDone = catchAsync(async (req, res) => {
  // console.log("on_record_done ", req.body);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

module.exports = { onConnect, onPlay, onPublish, onDone, onPlayDone, onPublishDone, onRecordDone }