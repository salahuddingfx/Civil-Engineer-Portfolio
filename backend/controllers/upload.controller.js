const cloudinary = require("cloudinary").v2;
const env = require("../config/env");

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

async function uploadImage(req, res, next) {
  try {
    const { dataUri, folder } = req.body;
    if (!dataUri) {
      return res.status(400).json({ message: "dataUri is required" });
    }

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: folder || "alam-ashik-portfolio",
      resource_type: "image",
      transformation: [
        { width: 2000, height: 2000, crop: "limit" }, // Downscale huge images to 2K for web performance
        { quality: "auto" }, // Auto-adjust quality for smallest file size with best visuals
        { fetch_format: "auto" }, // Auto-convert to WebP/AVIF if supported
      ],
    });

    return res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return next(error);
  }
}

module.exports = { uploadImage };
