const cloudinary = require('cloudinary').v2;

function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/** JPEG delivery — supported on virtually all phones, tablets, and browsers */
function cloudinaryDeliveryUrl(secureUrl) {
  if (!secureUrl || !secureUrl.includes('/image/upload/')) {
    return secureUrl;
  }
  const segment = '/image/upload/';
  const index = secureUrl.indexOf(segment);
  const prefix = secureUrl.slice(0, index + segment.length);
  const suffix = secureUrl.slice(index + segment.length);
  if (/^(f_|q_|c_|w_|h_|g_)/.test(suffix)) {
    return secureUrl;
  }
  return `${prefix}f_jpg,q_auto/${suffix}`;
}

function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'royal-academy',
        resource_type: 'image',
        format: 'jpg',
        quality: 'auto:good',
        flags: 'progressive',
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadBuffer,
  cloudinaryDeliveryUrl,
};
