const express = require('express');
const { viewController } = require('../../controllers');
const { auth, validate } = require("../../middlewares");
const userValidation = require('../../validations/user.validation');
const { uploadAvatar } = require("../../utils/upload")

const router = express.Router();

router.get('/player', viewController.player);

module.exports = router;
