const catchAsync = require('../utils/catchAsync');
const { fileService } = require('../services');

const uploadFile = catchAsync(async (req, res) => {
  const { bucketName, fileData } = req.body;
  const result = await fileService.uploadFile(bucketName, fileData);
  res.status(200).send(result);
});

const removeFile = catchAsync(async (req, res) => {
  const { bucketName, fileUrl } = req.body;
  await fileService.removeFile(bucketName, fileUrl);
  res.status(204).send();
});

module.exports = {
  uploadFile,
  removeFile,
};
