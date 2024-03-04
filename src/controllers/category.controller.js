const httpStatus = require("http-status");
const { catergoryService } = require("../services");
const exclude = require('../utils/exclude');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const create = catchAsync(async (req, res) => {
  let data = { name, index } = req.body
  data.index = parseInt(index) 
  let category = await catergoryService.create(data)
  res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: "success", data: { category: category }, error: "" });
});

const getAll = catchAsync(async (req, res) => {
  categories = await catergoryService.getAll()
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: categories, error: "" });
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params
  const category = await catergoryService.getById(id);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: category, error: null });
})

const updateById = catchAsync(async (req, res) => {
  const { id } = req.params
  const data = { name, index } = req.body
  const category = await catergoryService.updateById(id, data)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: category, error: "" });
});

const deleteById = catchAsync(async (req, res) => {
  const { id } = req.params
  category = await catergoryService.deleteById(id)
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: { category: category }, error: "" });
});


module.exports = { create, getAll, getById, updateById, deleteById }