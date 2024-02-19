const express = require('express');
const { liveController } = require('../../controllers');
const router = express.Router();

router.get('/analyst', liveController.analyst);

module.exports = router;
