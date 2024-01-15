const httpStatus = require("http-status");
const { catergoryService } = require("../services");
const exclude = require('../utils/exclude');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const create = catchAsync(async (req, res) => {
  const data = { name } = req.body
  let category = await catergoryService.create(data)
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: "success", data: { category: category }, error: "" });
});

const getAll = catchAsync(async (req, res) => {
});

module.exports = { create, getAll }