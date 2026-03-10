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

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *",
      [name, email, hashedPassword]
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, "secretkey");

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Signup failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
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

    const token = jwt.sign({ id: user.rows[0].id }, "secretkey");

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    res.json({ success: false, message: "Login failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});