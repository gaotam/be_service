const express = require('express');
const authController = require('../../controllers/auth.controller');
const { rateLimit, validate } = require("../../middlewares");
const authValidation = require('../../validations/auth.validation');
const { upload } = require("../../utils/upload")

const router = express.Router();

router.post('/login', validate(authValidation.login), authController.login);
// router.post('/signup', rateLimit, upload.single('image'), validate(authValidation.register), authController.signup);

module.exports = router;
