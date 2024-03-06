const express = require('express');
const { notificationController } = require('../../controllers');
const router = express.Router();

router.get('/', notificationController.getAll);
router.put('/:id', notificationController.updateById);
module.exports = router;
