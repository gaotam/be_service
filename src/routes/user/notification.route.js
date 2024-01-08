const express = require('express');
const { notificationController } = require('../../controllers');
const { rateLimit, validate } = require("../../middlewares");
const userValidation = require('../../validations/user.validation');
const { protect } = require("../../middlewares/auth")
const { updateFace } = require("../../utils/upload")

const router = express.Router();

router.post('/on_connect', notificationController.onConnect);
router.post('/on_play', notificationController.onPlay);
router.post('/on_publish', notificationController.onPublish);
router.post('/on_done', notificationController.onDone);
router.post('/on_play_done', notificationController.onPlayDone);
router.post('/on_publish_done', notificationController.onPublishDone);
router.post('/on_record_done', notificationController.onRecordDone);

module.exports = router;
