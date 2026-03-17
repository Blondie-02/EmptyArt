const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "artposts",
    resource_type: "image",
    format: file.mimetype.split("/")[1],
    public_id: `post-${Date.now()}`,
    transformation: [{ width: 800, height: 800, crop: "limit" }]
  }),
});

const allowedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  }
});

module.exports = upload;