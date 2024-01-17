const express = require('express');
const { videoController } = require('../../controllers');
const { auth, validate } = require("../../middlewares");
const { uploadVideo } = require("../../utils/upload")

const router = express.Router();

router.get('/', auth.protect, videoController.getAll);
router.post('/', auth.protect, uploadVideo.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video', maxCount: 1 }]), videoController.create);
router.delete('/:id', auth.protect, videoController.deleteById);

module.exports = router;
