const express = require('express');
const { categoryController } = require('../../controllers');
const { auth, validate } = require("../../middlewares");

const router = express.Router();

router.get('/', categoryController.getAll);
router.put('/:id', categoryController.updateById);
router.delete('/:id', categoryController.deleteById);

module.exports = router;
