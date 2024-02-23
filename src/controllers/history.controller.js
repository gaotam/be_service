const httpStatus = require("http-status");
const { historyService } = require("../services");
const pick = require('../utils/pick');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const getAll = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['q']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  history = await historyService.getAll({...filter, userId: req.user.id}, options)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: history, error: "" });
});

const deleteByUserId = catchAsync(async (req, res) => {
  const {id: userId} = req.user
  await historyService.deleteByUserId(userId)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});


module.exports = { getAll, deleteByUserId }