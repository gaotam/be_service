const express = require('express');
const { videoController } = require('../../controllers');
const { auth, validate } = require("../../middlewares");
const { uploadVideo } = require("../../utils/upload")

const router = express.Router();

router.get('/', videoController.getAll);
router.get('/me', auth.protect, videoController.getAllMe);
router.get('/trending', videoController.getVideoTrending);
router.get('/:id', videoController.getAllById);
router.get('/category/:name', videoController.category);
router.get('/:id', auth.checkAuth, videoController.getById);
router.post('/', auth.protect, uploadVideo.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video', maxCount: 1 }]), videoController.create);
router.put('/:id', auth.protect, uploadVideo.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video', maxCount: 1 }]), videoController.updateById);
router.delete('/:id', auth.protect, videoController.deleteById);

module.exports = router;
