const express = require('express');
const { categoryController } = require('../../controllers');
const { auth, validate } = require("../../middlewares");
const userValidation = require('../../validations/user.validation');
const { uploadAvatar } = require("../../utils/upload")

const router = express.Router();

router.post('/', auth.protect, categoryController.create);
// router.put('/', auth.protect, uploadAvatar.single("avatar"), userController.updateById);

module.exports = router;
