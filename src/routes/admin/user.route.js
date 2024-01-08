const express = require('express');
const { userController } = require('../../controllers');
const { userValidation } = require('../../validations');
const validate = require('../../middlewares/validate');
const { upload, uploadFace }  = require("../../utils/upload")

const router = express.Router();

router.get('/', validate(userValidation.getAll), userController.getAll);
router.get('/:userId', userController.getById);
router.post('/checkin-qr/:userId', userController.checkInQR);
router.post('/checkin-face', uploadFace.single('img'), userController.checkInFace);
router.post('/checkin/:q', userController.checkInPhoneOrEmail);
router.post('/generate-link/:id', userController.generateLinkUpdateFace);
router.post('/photo-censorship/:userId', userController.photoCensorship);
router.put('/:id', upload.single('image'), validate(userValidation.updateById), userController.updateById);
router.delete('/delete-image/:id', userController.deleteImage);

module.exports = router;
