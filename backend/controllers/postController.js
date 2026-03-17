const pool = require("../config/db"); // your PostgreSQL pool
const cloudinary = require("../config/cloudinary");


// Get all posts (user-aware)
const getAllPosts = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null; // optional current user

    // Fetch posts with author info
    const result = await pool.query(`
      SELECT 
        posts.*, 
        users.name AS author_name,
        COALESCE(users.avatar, 'https://i.pravatar.cc/100') AS author_avatar,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS likes_count,
        (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comments_count,
        (SELECT EXISTS(
            SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = $1
        )) AS liked,
        (SELECT EXISTS(
            SELECT 1 FROM saved_posts WHERE saved_posts.post_id = posts.id AND saved_posts.user_id = $1
        )) AS saved
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `, [userId]);

    const posts = result.rows.map(p => ({
      id: p.id,
      user: p.author_name,
      avatar: p.author_avatar,
      title: p.title,
      content: p.content,
      img: p.image_url,
      time: new Date(p.created_at).toLocaleDateString(),
      likes: parseInt(p.likes_count),
      comments: parseInt(p.comments_count),
      liked: p.liked,
      saved: p.saved,
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
      return res
        .status(400)
        .json({ success: false, message: "Title and content are required." });
    }

    // Get admin ID from the request (set by verifyAdmin)
    const userId = req.user.id;

    let imageUrl = null;

    // If an image file was uploaded, get its Cloudinary URL
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    // Insert into DB with proper user_id
    const query = `
      INSERT INTO posts (user_id, title, content, image_url, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
    const values = [userId, title, content, imageUrl];

    const result = await pool.query(query, values);

    res.json({ success: true, post: result.rows[0] });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create post." });
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