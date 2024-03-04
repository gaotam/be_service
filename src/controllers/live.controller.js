const httpStatus = require("http-status");
const axios = require("axios");
const { liveService, videoService, transcodeService} = require("../services");
const exclude = require('../utils/exclude');
const pick = require('../utils/pick');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { Status } = require("@prisma/client");

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

  let video = await videoService.create({...data, userId: userId, isLive: true})
  const videoRes = exclude(video, ['password']);
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: "success", data: videoRes, error: "" });
})

const updateById = catchAsync(async (req, res) => {
  const { id } = req.params
  const data = { categoryId, title, desc, disableComment, isRecord } = req.body
  const userId = req.user.id

  if(req.files?.thumbnail[0]){
    data["thumbnail"] = `/thumbnails/${req.files?.thumbnail[0].filename}`;
  }

  // const live = await liveService.create({isRecord: isRecord === "true"})
  data.isRecord = isRecord === "true"
  data.disableComment = disableComment === "true"

  let video = await liveService.updateById(id, {...data, userId: userId})
  const videoRes = exclude(video, ['password']);
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: "success", data: videoRes, error: "" });
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
  // console.log(req.body);
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

  await liveService.updateStatus(name, Status.PROCESS)
  _io.emit(`on-publish-${name}`, {})
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
  const {name} = req.body
  await liveService.updateStatus(name, Status.SUCCESS)
  _io.emit(`on-publish-done-${name}`, {})
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

const getViews = catchAsync(async (req, res) => {
  const { liveKey } = req.params
  const { data } = await axios.get(`${process.env.ENPOINT_RTMP_SERVER}/stat`)
  let views = -1;
  const applications = data["http-flv"]["servers"][0]["applications"]
  const idxLive = applications.findIndex(a => a.name == "live")
  const streams = applications[idxLive].live.streams.find(s => s.name == liveKey)
  if(streams){
    views = streams.clients.length;
  }
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: {views}, error: "" });

})

const deleteById = catchAsync(async (req, res) => {
  const { id } = req.params
  const video = await videoService.getById(id);
  await liveService.deleteById(video.livestream.id)
  await axios.post(`${process.env.ENPOINT_RTMP_SERVER}/control/drop/publisher?app=live&name=${video.livestream.liveKey}`)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const getAllMe = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['q', 'createdAt']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  videos = await videoService.getAll({...filter, userId: req.user.id, isLive: true}, options)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: videos, error: "" });
});

module.exports = { onConnect, onPlay, onPublish, onDone, onPlayDone, onPublishDone, onRecordDone, create, analyst, updateById, getViews, deleteById, getAllMe}