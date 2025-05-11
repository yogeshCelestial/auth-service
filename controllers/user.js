// CRUD users
const { v4: uuidv4 } = require("uuid");
const db = require("../db.js");
const { hashPassword } = require("../utils.js");

const createUser =  async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const user = [
    uuidv4(),
    name,
    email,
    hashedPassword,
    1,
    // new Date().toISOString(),
    // new Date().toISOString(),
  ];
  db.run(
    `INSERT INTO users (id, name, email, password, is_active)
   VALUES (?, ?, ?, ?, ?)`,
    user,
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "User created" });
    }
  );
};

const getAllUsers = () => {};

const updateUser = () => {};

const deleteUser = () => {};

const getUserByEmail = (req, res) => {
  const { email } = req.params;
  const emailDecoded = Buffer.from(email, "base64").toString("utf-8");
  db.get(`SELECT * FROM users WHERE email = ?`, [emailDecoded], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(row);
  });
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
};
