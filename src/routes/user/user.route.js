const express = require('express');
const { userController } = require('../../controllers');
const { auth, validate } = require("../../middlewares");
const userValidation = require('../../validations/user.validation');
const { uploadImages } = require("../../utils/upload")

const router = express.Router();

router.get('/profile', auth.protect, userController.getOne);
router.get('/:id', userController.getById);
router.put('/change-password', auth.protect, userController.changePassword);
router.put('/', auth.protect, uploadImages.single("avatar"), userController.updateById);

module.exports = router;
