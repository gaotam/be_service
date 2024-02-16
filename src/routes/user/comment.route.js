const express = require('express');
const { commentController } = require('../../controllers');
const { auth, validate } = require("../../middlewares");
const { uploadVideo } = require("../../utils/upload")

const router = express.Router();

router.get('/', commentController.getAll);
router.post('/', commentController.create);
router.put('/:id', commentController.updateById);
router.delete('/:id', commentController.deleteById);

module.exports = router;
