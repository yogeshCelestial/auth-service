// CRUD users
const { v4: uuidv4 } = require("uuid");
const db = require("../db.js");

const createUser = (req, res) => {
  const { name, email, password } = req.body;
  const user = [
    uuidv4(),
    name,
    email,
    password,
    1,
    new Date().toISOString(),
    new Date().toISOString(),
  ];

  const id = uuidv4();
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO users (id, name, email, password, is_active, created_at, updated_at)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
    user,
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id, message: "User created" });
    }
  );
};

const getAllUsers = () => {};

const updateUser = () => {};

const deleteUser = () => {};

const getUserByEmail = () => {};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
};
