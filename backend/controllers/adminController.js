const pool = require("../config/db");

// COMMENTS
const getAllComments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.name as user_name, p.title as post_title
      FROM comments c
      JOIN users u ON c.user_id = u.id
      JOIN posts p ON c.post_id = p.id
      ORDER BY c.id DESC
    `);

    res.json({ success: true, comments: result.rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const deleteComment = async (req, res) => {
  await pool.query("DELETE FROM comments WHERE id=$1", [req.params.id]);
  res.json({ success: true });
};

// LIKES
const getAllLikes = async (req, res) => {
  const result = await pool.query(`
    SELECT l.*, u.name as user_name, p.title as post_title
    FROM likes l
    JOIN users u ON l.user_id = u.id
    JOIN posts p ON l.post_id = p.id
  `);

  res.json({ success: true, likes: result.rows });
};

const deleteLike = async (req, res) => {
  await pool.query("DELETE FROM likes WHERE id=$1", [req.params.id]);
  res.json({ success: true });
};

// MESSAGES
const getAllMessages = async (req, res) => {
  const result = await pool.query(`
    SELECT m.*, 
      s.name as sender_name,
      r.name as receiver_name
    FROM messages m
    JOIN users s ON m.sender_id = s.id
    JOIN users r ON m.receiver_id = r.id
  `);

  res.json({ success: true, messages: result.rows });
};

const deleteMessage = async (req, res) => {
  await pool.query("DELETE FROM messages WHERE id=$1", [req.params.id]);
  res.json({ success: true });
};

module.exports = {
  getAllComments,
  deleteComment,
  getAllLikes,
  deleteLike,
  getAllMessages,
  deleteMessage
};