const pool = require("../db"); // adjust path to your Postgres pool

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await pool.query(
      "SELECT * FROM posts ORDER BY id DESC"
    );
    res.json(posts.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// Create a post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author_id = req.user.id;

    const image_url = req.file.path; // or your Cloudinary URL

    const newPost = await pool.query(
      "INSERT INTO posts(title, content, image_url, author_id) VALUES($1, $2, $3, $4) RETURNING *",
      [title, content, image_url, author_id]
    );

    res.json({ success: true, post: newPost.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};