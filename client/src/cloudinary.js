import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      transformation: [
        { width: 500, height: 500, crop: "fill", quality: "auto" }, // Optimize image
        { fetch_format: "auto" }, // Auto-format (webp, jpg, etc.)
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
};
