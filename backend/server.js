// server.js
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const { verifyAdmin } = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

// --- Create a single Pool instance ---
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "artapp",
  password: "1234",
  port: 5432,
});

// Optional: test connection on startup
pool
  .connect()
  .then(client => {
    console.log("PostgreSQL connected successfully");
    client.release();
  })
  .catch(err => {
    console.error("Failed to connect to PostgreSQL:", err);
  });

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// --- Admin routes ---
const adminRoutes = [
  {
    method: "get",
    path: "/comments",
    query: `
      SELECT comments.*, users.name AS user_name, posts.title AS post_title
      FROM comments
      JOIN users ON comments.user_id = users.id
      JOIN posts ON comments.post_id = posts.id
      ORDER BY comments.created_at DESC
    `
  },
  {
    method: "delete",
    path: "/comments/:id",
    query: "DELETE FROM comments WHERE id=$1"
  },
  {
    method: "get",
    path: "/likes",
    query: `
      SELECT likes.*, users.name AS user_name, posts.title AS post_title
      FROM likes
      JOIN users ON likes.user_id = users.id
      JOIN posts ON likes.post_id = posts.id
      ORDER BY likes.created_at DESC
    `
  },
  {
    method: "delete",
    path: "/likes/:id",
    query: "DELETE FROM likes WHERE id=$1"
  },
  {
    method: "get",
    path: "/messages",
    query: `
      SELECT messages.*, s.name AS sender_name, r.name AS receiver_name
      FROM messages
      JOIN users s ON messages.sender_id = s.id
      JOIN users r ON messages.receiver_id = r.id
      ORDER BY messages.created_at DESC
    `
  },
  {
    method: "delete",
    path: "/messages/:id",
    query: "DELETE FROM messages WHERE id=$1"
  }
];

// Auto-generate admin routes
adminRoutes.forEach(route => {
  app[route.method](`/api/admin${route.path}`, verifyAdmin, async (req, res) => {
    try {
      let result;
      if (route.method === "get") {
        result = await pool.query(route.query);
        const key = route.path.includes("comments") ? "comments" :
                    route.path.includes("likes") ? "likes" : "messages";
        res.json({ success: true, [key]: result.rows });
      } else if (route.method === "delete") {
        const { id } = req.params;
        await pool.query(route.query, [id]);
        res.json({ success: true, message: `${route.path.split("/")[1].slice(0,-1)} deleted` });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Database operation failed" });
    }
  });
});

// --- Start server ---
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { pool }; // export for testing if needed