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
      transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
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
