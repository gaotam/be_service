const express = require('express');
const { liveController } = require('../../controllers');
const { rateLimit, validate } = require("../../middlewares");
const userValidation = require('../../validations/user.validation');
const { protect } = require("../../middlewares/auth")
const { updateFace } = require("../../utils/upload")

const router = express.Router();

router.post('/on_connect', liveController.onConnect);
router.post('/on_play', liveController.onPlay);
router.post('/on_publish', liveController.onPublish);
router.post('/on_done', liveController.onDone);
router.post('/on_play_done', liveController.onPlayDone);
router.post('/on_publish_done', liveController.onPublishDone);
router.post('/on_record_done', liveController.onRecordDone);

module.exports = router;
