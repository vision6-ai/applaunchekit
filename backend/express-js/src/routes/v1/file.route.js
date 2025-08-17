const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const fileValidation = require('../../validations/file.validation');
const fileController = require('../../controllers/file.controller');

const router = express.Router();

router.route('/upload').post(auth(), validate(fileValidation.uploadFile), fileController.uploadFile);
router.route('/remove').post(auth(), validate(fileValidation.removeFile), fileController.removeFile);

module.exports = router;
