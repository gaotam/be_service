const express = require('express');
const { commentController } = require('../../controllers');
const { auth, validate } = require("../../middlewares");
const { uploadVideo } = require("../../utils/upload")

const router = express.Router();

router.get('/', commentController.getAll);
router.get('/me', auth.protect, commentController.getAllMe);
router.post('/', auth.protect, commentController.create);
router.put('/:id', auth.protect, commentController.updateById);
router.delete('/:id', auth.protect, commentController.deleteById);

module.exports = router;
