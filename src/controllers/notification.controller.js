const httpStatus = require("http-status");
const { notificationService } = require("../services");
const pick = require('../utils/pick');
const exclude = require('../utils/exclude');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const getAll = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const user = req.user;
  const data = await notificationService.getAll({...filter, userId: user.id}, options)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: {...data}, error: "" });
});

const updateById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  await notificationService.updateById(id, { watched: true })
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

module.exports = { getAll, updateById}