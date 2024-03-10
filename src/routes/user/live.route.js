const express = require('express');
const { liveController } = require('../../controllers');
const { protect, authorize } = require("../../middlewares/auth")
const { uploadVideo } = require("../../utils/upload")

const router = express.Router();

router.get('/me', protect, liveController.getAllMe);
router.get('/', liveController.getAll);
router.get('/:id', liveController.getAllById);
// router.get('/:liveKey', liveController.getViews);
router.post('/', protect, uploadVideo.single("thumnail"), liveController.create);
router.put('/:id', protect, uploadVideo.single("thumnail"), liveController.updateById);
router.post('/on_connect', liveController.onConnect);
router.post('/on_play', liveController.onPlay);
router.post('/on_publish', liveController.onPublish);
router.post('/on_done', liveController.onDone);
router.post('/on_play_done', liveController.onPlayDone);
router.post('/on_publish_done', liveController.onPublishDone);
router.post('/on_record_done', liveController.onRecordDone);
router.delete('/:id', liveController.deleteById);


module.exports = router;
