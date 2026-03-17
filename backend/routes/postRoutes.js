const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { verifyAdmin } = require("../middleware/auth");
const { getAllPosts, createPost, deletePost } = require("../controllers/postController");


router.get("/", getAllPosts);

router.post("/admin/create-post", verifyAdmin, upload.single("image"), createPost);

router.delete("/admin/delete-post/:id", verifyAdmin, deletePost);

module.exports = router;