const { Router } = require("express");
const db = require("../db.js");
const { v4: uuidv4 } = require("uuid");
const routes = Router();
const { createUser, getUserByEmail } = require("../controllers/user.js");

// CRUD
routes.post("/create", createUser);

routes.get("/email/:email", getUserByEmail);

module.exports = routes;
