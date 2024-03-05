const httpStatus = require("http-status");
const { subscriptionService } = require("../services");
const exclude = require('../utils/exclude');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const create = catchAsync(async (req, res) => {
  const { type, subId } = req.query
  const user = req.user;
  await subscriptionService.create(type, user.id, subId)
  res.status(httpStatus.CREATED).send({ code: httpStatus.OK, message: "success", data: null, error: "" });
});

const getAll = catchAsync(async (req, res) => {
  const user = req.user;
  const subs = await subscriptionService.getAll(user.id)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: subs, error: "" });
});

const getBySubId = catchAsync(async (req, res) => {
  const { id } = req.params
  const user = req.user;
  const sub = await subscriptionService.getBySubId(user.id, id);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: sub, error: null });
})

module.exports = { create, getAll, getBySubId}