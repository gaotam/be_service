const express = require('express');
const { userController } = require('../../controllers');
const { rateLimit, validate } = require("../../middlewares");
const userValidation = require('../../validations/user.validation');
const { protect } = require("../../middlewares/auth")
const { updateFace } = require("../../utils/upload")

const router = express.Router();

router.get('/', rateLimit, validate(userValidation.getOne), userController.getOne);
router.get('/check-link', protect, userController.checkLinkUpdateFace)
router.put('/', protect, updateFace.single("image"), userController.updateFace);

module.exports = router;
