const db = require("./../db.js");
const {
  comparePassword,
  generateJWT,
  generateRefreshToken,
} = require("../utils.js");
const { v4: uuidv4 } = require("uuid");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  db.get(`SELECT * FROM users WHERE email = ?`, email, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = row;
    // Check if the user is active
    if (user.is_active === 0) {
      return res.status(403).json({ message: "User is inactive" });
    }
    const isPasswordValid = comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateJWT(user);
    // Generate a refresh token and save it to the database
    const refreshToken = generateRefreshToken(user);
    db.run(
      `INSERT INTO refresh_tokens (id, user_id, token) VALUES (?, ?, ?)`,
      [uuidv4(), user.id, refreshToken],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
};

const logout = async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  login,
  logout,
};
