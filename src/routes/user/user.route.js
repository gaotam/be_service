const express = require('express');
const { userController } = require('../../controllers');
const { auth, validate } = require("../../middlewares");
const userValidation = require('../../validations/user.validation');
const { uploadAvatar } = require("../../utils/upload")

const router = express.Router();

router.get('/', auth.protect, userController.getOne);
router.put('/', auth.protect, uploadAvatar.single("avatar"), userController.updateById);

module.exports = router;
