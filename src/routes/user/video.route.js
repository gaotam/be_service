const express = require('express');
const { videoController } = require('../../controllers');
const { auth, validate } = require("../../middlewares");
const { uploadThumbnail } = require("../../utils/upload")

const router = express.Router();

router.get('/', auth.protect, videoController.getAll);
router.post('/', auth.protect, uploadThumbnail.single("thumbnail"), videoController.create);
router.delete('/:id', auth.protect, videoController.deleteById);

module.exports = router;
