const express = require('express');
const authController = require('../../controllers/auth.controller');
const { auth, validate } = require("../../middlewares");
const authValidation = require('../../validations/auth.validation');

const router = express.Router();

router.post('/login', validate(authValidation.login), authController.login);
router.post('/signup', authController.signup);

module.exports = router;
