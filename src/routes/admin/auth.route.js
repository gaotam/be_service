const express = require('express');
const authController = require('../../controllers/auth.controller');
const authValidation = require('../../validations/auth.validation');
const { validate, auth } = require("../../middlewares");
const router = express.Router();

router.post('/signup', auth.secret, validate(authValidation.registerAdmin), authController.signupAdmin);
router.post('/signup-user', authController.adminSignupUser)
module.exports = router;
