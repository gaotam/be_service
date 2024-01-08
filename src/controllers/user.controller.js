const httpStatus = require("http-status");
const cache = require('../config/cache')
const { userService, captchaService, aiService, tokenService } = require("../services");

const catchAsync = require("../utils/catchAsync");
const pick = require('../utils/pick');
const exclude = require('../utils/exclude');
const ApiError = require("../utils/ApiError");

const getAll = catchAsync(async (req, res) => {
  httpUserCounter.inc("GET", "/users")
  const filter = pick(req.query, ['q', 'checkin']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const data = await userService.getAll(filter, options)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, msg: "success", data: {...data}, error: "" });
})

const getOne = catchAsync(async (req, res) => {
  httpUserCounter.inc("GET", "/users?q=")
  const { q } = req.query;
  const isSuccess = await captchaService.verify(req.headers['recaptcha'])
  if(!isSuccess){
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "captcha not valid");
  }

  const user = cache.get(`user-${q}`)
  if(user){
    return res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: { user: user }, error: null });
  }
  const data = await userService.getOne(q)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: { user: data }, error: null });
})

const getById = catchAsync(async (req, res) => {
  const { userId } = req.params
  const user = cache.get(`user-${userId}`)
  if(user){
    return res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: { user: user }, error: "" });
  }
  const data = await userService.getById(userId);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: { user: data }, error: null });
})

const checkInQR = catchAsync(async (req, res) => {
  httpUserCounter.inc("POST", "/admin/users/checkin-qr")
  const { userId } = req.params;
  const user = await userService.checkInQR(userId);
  _io.emit("user-checkin", {});
  const userExclude = exclude(user, ['password', 'image', 'checkinType', 'acceptFace', 'role', 'createdAt', 'updatedAt'])
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: { user: userExclude }, error: null });
});

const checkInPhoneOrEmail = catchAsync(async (req, res) => {
  const { q } = req.params;
  const user = await userService.checkInByPhoneOrEmail(q);
  _io.emit("user-checkin", {});
  const userExclude = exclude(user, ['password', 'image', 'checkinType', 'acceptFace', 'role', 'createdAt', 'updatedAt'])
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: { user: userExclude }, error: null });
});

const checkInFace = catchAsync(async (req, res) => {
  const { originalname } = req.file;
  const userFace = await aiService.checkinFace(originalname, req.file.buffer);
  const user = await userService.checkInByFace(userFace.phone);
  _io.emit("user-checkin", {});
  const userExclude = exclude(user, ['password', 'image', 'checkinType', 'acceptFace', 'role', 'createdAt', 'updatedAt'])
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: { user: userExclude }, error: null });
});

const photoCensorship = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await userService.photoCensorship(userId);
  mailFaceQueue.add({ userId: user.id, email: user.email, fullName: user.fullName });
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: null });
})

const updateById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = { course, facebook, email, fullName, phone, reCaptchaRes } = req.body
  if(req.file){
    data["image"] = req.file.filename;
  }
  const user = await userService.updateById(id, data)
  cache.set(`user-${id}`, user);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: {user: user}, error: null });
})

const generateLinkUpdateFace = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = await userService.getById(id);
  cache.del(`face-${id}`);
  const token = await tokenService.generateUpdateFaceToken(user.id);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: { token }, error: null });
})

const checkLinkUpdateFace = catchAsync(async (req, res) => {
  const { id, fullName } = req.user;
  const isUpdate = cache.get(`face-${id}`);

  if(isUpdate){
    return res.status(httpStatus.BAD_REQUEST).send({ code: httpStatus.BAD_REQUEST, message: "error", data: null, error: "your link has expired" });
  }

  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: { user: { fullName } }, error: null });
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
  checkInQR,
  checkInFace,
  checkInPhoneOrEmail,
  updateById,
  photoCensorship,
  deleteImage,
  checkLinkUpdateFace,
  generateLinkUpdateFace,
  updateFace,
};