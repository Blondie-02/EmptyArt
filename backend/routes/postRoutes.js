const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { getAllPosts, createPost, deletePost } = require("../controllers/postController");

// Get all posts
router.get("/", getAllPosts);

// Create a post (admin) with image upload
router.post("/admin/create-post", verifyAdmin, upload.single("image"), createPost);

// Delete a post (admin)
router.delete("/admin/delete-post/:id", verifyAdmin, deletePost);

module.exports = router;