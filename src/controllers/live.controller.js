const httpStatus = require("http-status");
const axios = require("axios");
const { liveService, videoService } = require("../services");
const exclude = require('../utils/exclude');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const create = catchAsync(async (req, res) => {
  const data = { categoryId, title, desc, disableComment, isRecord } = req.body
  const userId = req.user.id

  if(req.files?.thumbnail[0]){
    data["thumbnail"] = `/thumbnails/${req.files?.thumbnail[0].filename}`;
  }

  const live = await liveService.create({isRecord: isRecord === "true"})
  delete data.isRecord
  data.livestreamId = live.id

  data.disableComment = disableComment === "true"

  let video = await videoService.create({...data, userId: userId})
  const videoRes = exclude(video, ['password']);
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: "success", data: { video: videoRes}, error: "" });
})

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
    // await transcodeService.startTranscodeLive(liveKey)
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

const analyst = catchAsync(async (req, res) => {
  const { data } = await axios.get(`${process.env.ENPOINT_RTMP_SERVER}/stat`)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: data, error: "" });
});

module.exports = { onConnect, onPlay, onPublish, onDone, onPlayDone, onPublishDone, onRecordDone, create, analyst }