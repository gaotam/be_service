const httpStatus = require("http-status");
const cache = require('../config/cache')
const { userService, videoService, subscriptionService } = require("../services");

const catchAsync = require("../utils/catchAsync");
const pick = require('../utils/pick');
const exclude = require('../utils/exclude');
const ApiError = require("../utils/ApiError");

const getAll = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['q', 'role', 'isLock']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const data = await userService.getAll(filter, options)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, msg: "success", data: {...data}, error: "" });
})

const getOne = catchAsync(async (req, res) => {
  const userId = req.user.id
  // const user = cache.get(`user-${userId}`)
  // if(user){
  //   const userRes = exclude(user, ['password', 'role', 'updatedAt']);
  //   return res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: userRes, error: null });
  // }
  const data = await userService.getById(userId)
  const videos = await videoService.getAll({userId}, {})
  const totalSub = await subscriptionService.getTotalSubUser(userId)
  data.totalVideo = videos.total
  data.totalSub = totalSub
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: data, error: null });
})

const getById = catchAsync(async (req, res) => {
  const { id } = req.params
  // let user = cache.get(`user-${id}`)
  // if(user){
  //   return res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: user, error: "" });
  // }
  const user = await userService.getById(id);
  const videos = await videoService.getAll({userId: id}, {})
  const totalSub = await subscriptionService.getTotalSubUser(id)
  const userRes = exclude(user, ['password']);
  userRes.totalVideo = videos.total
  userRes.totalSub = totalSub
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: userRes, error: null });
})

const updateById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const data = { fullname, gender, email } = req.body
  if(req.file){
    data["avatar"] = `/avatar/${req.file.filename}`;
  }
  const user = await userService.updateById(userId, data)
  cache.set(`user-${userId}`, user);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: {user: user}, error: null });
})

const changePassword = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, password } = req.body
  await userService.changePassword(userId, oldPassword, password)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: null });
})

const lockUserById = catchAsync(async (req, res) => {
  const { userId } = req.params
  const { isLock } = req.body
  const user = await userService.lockUserById(userId, isLock)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: {user: user}, error: null });
})

const changeRole = catchAsync(async (req, res) => {
  const { userId } = req.params
  const { role } = req.body
  await userService.changeRole(userId, role)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: null });
})

const updateFace = catchAsync(async (req, res) => {
  const { id } = req.user;
  const isUpdate = cache.get(`face-${id}`);
  if(isUpdate){
    return res.status(httpStatus.BAD_REQUEST).send({ code: httpStatus.BAD_REQUEST, message: "error", data: null, error: "your link has expired" });
  }

  if(!req.file){
    return res.status(httpStatus.BAD_REQUEST).send({ code: httpStatus.BAD_REQUEST, message: "error", data: null, error: "photo is required" });
  }
  
  const user = await userService.updateById(id, { image: req.file.filename });
  cache.set(`face-${id}`, true);
  cache.set(`user-${id}`, user);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: null });
})

const deleteImage = catchAsync(async (req, res) => {
  const { id } = req.params;
  await userService.deleteImage(id);
  cache.del(`user-${id}`);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: null });
})

module.exports = {
  getAll,
  getById,
  getOne,
  updateById,
  changeRole,
  deleteImage,
  updateFace,
  lockUserById,
  changePassword
};