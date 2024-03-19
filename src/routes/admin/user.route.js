const express = require('express');
const { userController } = require('../../controllers');
const { userValidation } = require('../../validations');
const validate = require('../../middlewares/validate');
const { upload, uploadFace }  = require("../../utils/upload")

const router = express.Router();

router.get('/', userController.getAll);
router.get('/:userId', userController.getById);
router.put('/change-role/:userId', userController.changeRole);
router.put('/:userId', userController.lockUserById);

module.exports = router;
