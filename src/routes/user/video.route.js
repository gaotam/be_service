const express = require('express');
const { videoController } = require('../../controllers');
const { auth, validate } = require("../../middlewares");
const { uploadVideo } = require("../../utils/upload")

const router = express.Router();

router.get('/', videoController.getAll);
router.get('/trending', videoController.getVideoTrending);
router.get('/:id', videoController.getById);
router.post('/', auth.protect, uploadVideo.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video', maxCount: 1 }]), videoController.create);
router.delete('/:id', auth.protect, videoController.deleteById);

module.exports = router;
