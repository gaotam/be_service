const express = require('express');
const { videoController } = require('../../controllers');
const { auth, validate } = require("../../middlewares");
const { uploadVideo } = require("../../utils/upload")

const router = express.Router();

router.get('/', videoController.getAll);
router.delete('/:id', videoController.deleteById);

module.exports = router;
