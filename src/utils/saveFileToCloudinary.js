import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import { getEnvVar } from './getEnvVar.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar('CLOUD_NAME'),
  api_key: getEnvVar('CLOUD_API_KEY'),
  api_secret: getEnvVar('CLOUD_API_SECRET'),
});

export const saveFileToCloudinary = async (filePath) => {
  //   const response = await cloudinary.v2.uploader(filePath);
  //   await fs.unlink(file.path);

  //   return response.secure_url;
  return cloudinary.v2.uploader.upload(filePath);
};
