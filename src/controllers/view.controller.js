const httpStatus = require("http-status");
const exclude = require('../utils/exclude');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const player = catchAsync(async (req, res) => {
    res.render('player', {});
})

module.exports = { player }
