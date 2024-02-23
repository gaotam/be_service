const express = require('express');
const { historyController } = require('../../controllers');

const router = express.Router();

router.get('/', historyController.getAll);
router.delete('/', historyController.deleteByUserId);

module.exports = router;
