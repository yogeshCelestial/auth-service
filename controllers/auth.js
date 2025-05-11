const db = require("./../db.js");
const {
  comparePassword,
  generateJWT,
  generateRefreshToken,
  sendTokensToClient,
  verifyRefreshToken,
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
    sendTokensToClient(res, refreshToken, user, "Login successful");
  });
};

const manageRefreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  // Check if the refresh token is present in the request
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }
  // Verify the refresh token
  const isTokenValid = await verifyRefreshToken(refreshToken);
  console.log("isTokenValid", isTokenValid);
  if (!isTokenValid) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
  // Check if the refresh token exists in the database
  // and is associated with the user
  // If it exists, generate a new refresh token and send it to the client
  db.get(
    `SELECT * FROM refresh_tokens WHERE token = ?`,
    refreshToken,
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      const userId = row.user_id;
      db.get(`SELECT * FROM users WHERE id = ?`, userId, (err, userRow) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!userRow) {
          return res.status(404).json({ message: "User not found" });
        }
        // new refresh token
        const newRefreshToken = generateRefreshToken(userRow);
        db.run(
          `UPDATE refresh_tokens SET token = ? WHERE id = ?`,
          [newRefreshToken, row.id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
          }
        );
        sendTokensToClient(
          res,
          newRefreshToken,
          userRow,
          "Refresh token successful"
        );
      });
    }
  );
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  // Check if the refresh token is present in the request
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }
  // Check if the refresh token exists in the database
  db.get(
    `SELECT * FROM refresh_tokens WHERE token = ?`,
    refreshToken,
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      // Delete the refresh token from the database
      db.run(`DELETE FROM refresh_tokens WHERE id = ?`, row.id, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      });
    }
  );
  // Clear the refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  login,
  logout,
  manageRefreshToken,
};
