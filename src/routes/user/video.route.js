const express = require('express');
const { videoController } = require('../../controllers');
const { auth, validate } = require("../../middlewares");
const { uploadAvatar } = require("../../utils/upload")

const router = express.Router();

router.post('/', auth.protect, uploadAvatar.single("thumbnail"), videoController.create);

module.exports = router;
