const { Router } = require("express");
const routes = Router();
const { login, logout } = require("../controllers/auth.js");

routes.post("/login", login);

routes.get("/logout", logout);

// routes.get("/refresh-token", issueRefreshToken);

module.exports = routes;
