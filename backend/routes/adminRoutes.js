const express = require("express");
const router = express.Router();

const { verifyAdmin } = require("../middleware/auth");
const {
  getAllComments,
  deleteComment,
  getAllLikes,
  deleteLike,
  getAllMessages,
  deleteMessage
} = require("../controllers/adminController");

// COMMENTS
router.get("/admin/comments", verifyAdmin, getAllComments);
router.delete("/admin/comments/:id", verifyAdmin, deleteComment);

// LIKES
router.get("/admin/likes", verifyAdmin, getAllLikes);
router.delete("/admin/likes/:id", verifyAdmin, deleteLike);

// MESSAGES
router.get("/admin/messages", verifyAdmin, getAllMessages);
router.delete("/admin/messages/:id", verifyAdmin, deleteMessage);

module.exports = router;