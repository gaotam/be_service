const express = require('express');
const { liveController } = require('../../controllers');
const router = express.Router();

router.get('/', liveController.getAll);
router.get('/analyst', liveController.analyst);
router.delete('/:id', liveController.deleteById);

module.exports = router;
