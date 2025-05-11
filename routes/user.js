const { Router } = require("express");
const routes = Router();
const { createUser, getUserByEmail } = require("../controllers/user.js");

// CRUD
routes.post("/create", createUser);

routes.get("/email/:email", getUserByEmail);

module.exports = routes;
