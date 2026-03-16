const pool = require("../config/database"); // your PostgreSQL pool
const cloudinary = require("../config/cloudinary");

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );

    const posts = result.rows.map(p => ({
      id: p.id,

      // user info (temporary defaults)
      user: "Admin",
      handle: "@emptyart",
      avatar: "https://i.pravatar.cc/100",

      // post content
      title: p.title,
      content: p.content,
      img: p.image_url,

      // time formatting
      time: new Date(p.created_at).toLocaleDateString(),

      // social features defaults
      likes: 0,
      comments: 0,
      liked: false,
      saved: false,
      tags: ["art"]
    }));

    res.json({ success: true, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch posts." });
  }
};

// Create a post (admin)
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required." });
    }

    let imageUrl = null;

    // If an image file was uploaded, get its Cloudinary URL
    if (req.file && req.file.path) {
      imageUrl = req.file.path; // CloudinaryStorage puts the URL here
    }

    // Insert into DB
    const query = `
      INSERT INTO posts (title, content, image_url, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [title, content, imageUrl];

    const result = await pool.query(query, values);

    res.json({ success: true, post: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create post." });
  }
};

// Delete a post (admin)
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete post." });
  }
};

module.exports = { getAllPosts, createPost, deletePost };