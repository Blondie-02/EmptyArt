const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "artapp",
  password: "1234",
  port: 5432,
});

// ------------------ SIGNUP ------------------
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase(); // normalize email

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user with default role 'user'
    const newUser = await pool.query(
      "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *",
      [name, normalizedEmail, hashedPassword]
    );c

    const token = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role },
      "secretkey"
    );

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    console.log(err);
    if (err.code === "23505") { // unique email violation
      res.json({ success: false, message: "Email already exists" });
    } else {
      res.json({ success: false, message: "Signup failed" });
    }
  }
});

// ------------------ LOGIN ------------------
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase(); // normalize email

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [normalizedEmail]
    );

    if (user.rows.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.json({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      "secretkey"
    );

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    res.json({ success: false, message: "Login failed" });
  }
});

// ------------------ ADMIN MIDDLEWARE ------------------
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "secretkey");
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ------------------ CREATE POST (ADMIN) ------------------
app.post("/api/admin/create-post", verifyAdmin, async (req, res) => {
  try {
    const { title, content, image_url } = req.body;
    const author_id = req.user.id;

    const newPost = await pool.query(
      "INSERT INTO posts (title, content, image_url, author_id) VALUES ($1,$2,$3,$4) RETURNING *",
      [title, content, image_url, author_id]
    );

    res.json({ success: true, post: newPost.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating post" });
  }
});

// ------------------ FETCH POSTS ------------------
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await pool.query(
      "SELECT posts.*, users.name as author_name FROM posts JOIN users ON posts.author_id = users.id ORDER BY created_at DESC"
    );
    res.json({ success: true, posts: posts.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Cannot fetch posts" });
  }
});

// ------------------ CREATE FIRST ADMIN  ------------------
(async () => {
  try {
    const email = "blondie@test.com";      
    const password = "Blondie1234";           
    const name = "Blondie";              

    const existing = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (existing.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'admin') RETURNING *",
        [name, email, hashedPassword]
      );
      console.log(" Admin created:", newAdmin.rows[0]);
    } else {
      console.log(" Admin already exists");
    }
  } catch (err) {
    console.error(" Failed to create admin:", err);
  }
})();

// ------------------ START SERVER ------------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});