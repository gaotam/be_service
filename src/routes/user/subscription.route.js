const express = require('express');
const { subscriptionController } = require('../../controllers');

const router = express.Router();

router.get('/', subscriptionController.getAll);
router.get('/:id', subscriptionController.getBySubId);
router.post('/', subscriptionController.create);


module.exports = router;
