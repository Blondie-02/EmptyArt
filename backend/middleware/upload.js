// middleware/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // make sure this exports your cloudinary instance

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "artposts",
      format: file.mimetype.split("/")[1], // jpg, png, jpeg
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

// Multer instance
const upload = multer({ storage });

// Export multer instance
module.exports = upload;