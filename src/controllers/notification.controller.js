const httpStatus = require("http-status");
const { notificationService } = require("../services");
const exclude = require('../utils/exclude');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const getAll = catchAsync(async (req, res) => {
  const user = req.user;
  const notifications = await notificationService.getAll(user.id)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: notifications, error: "" });
});

module.exports = { getAll }