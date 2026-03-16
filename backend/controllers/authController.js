const pool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ------------------ SIGNUP ------------------
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *",
      [name, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role },
      "secretkey"
    );

    res.json({ success: true, token, user: { id: newUser.rows[0].id, role: newUser.rows[0].role, name: newUser.rows[0].name } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------ LOGIN ------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (user.rows.length === 0) return res.json({ success: false, message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, "secretkey");

    res.json({
      success: true,
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        role: user.rows[0].role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};