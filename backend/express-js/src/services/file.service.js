const Minio = require('minio');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');

const minioClient = new Minio.Client({
  endPoint: config.minio.endPoint,
  port: config.minio.port,
  useSSL: config.minio.useSSL,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
});

const uploadFile = async (bucketName, fileData) => {
  if (bucketName !== 'cover_images' && bucketName !== 'profile_images') {
    throw new ApiError(400, 'Invalid bucket name');
  }

  const bucketNameToPush = bucketName.replace('_', '-');

  const fileType = fileData.match(/^data:image\/(\w+);base64,/)[1];
  const base64Data = fileData.replace(/^data:image\/(\w+);base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const fileName = `${Date.now()}.${fileType}`;

  // Check if the bucket exists, if not, create it
  try {
    const bucketExists = await minioClient.bucketExists(bucketNameToPush);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketNameToPush);
    }
  } catch (error) {
    await minioClient.makeBucket(bucketNameToPush);
  }

  // Upload the file
  await minioClient.putObject(bucketNameToPush, fileName, buffer);

  // Get the file URL
  const fileUrl = await minioClient.presignedGetObject(bucketNameToPush, fileName, 0);

  return {
    fullPath: fileUrl,
    path: `${bucketName}/${fileName}`,
  };
};

const removeFile = async (bucketName, fileUrl) => {
  if (bucketName !== 'cover_images' && bucketName !== 'profile_images') {
    throw new ApiError(400, 'Invalid bucket name');
  }

  const bucketNameToPush = bucketName.replace('_', '-');

  // Extract the file name from the presigned URL
  const urlParts = new URL(fileUrl);
  const fileName = urlParts.pathname.split('/').pop();

  if (!fileName) {
    throw new ApiError(400, 'Invalid file URL');
  }

  try {
    await minioClient.removeObject(bucketNameToPush, fileName);
  } catch (error) {
    throw new ApiError(500, 'Failed to remove file', error);
  }
};

module.exports = {
  uploadFile,
  removeFile,
};
