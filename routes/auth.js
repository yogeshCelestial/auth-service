const { Router } = require("express");
const routes = Router();
const { login, logout, manageRefreshToken } = require("../controllers/auth.js");
const { authenticateAccessToken } = require("../middleware.js");

routes.post("/login", login);

routes.get("/logout", authenticateAccessToken, logout);

routes.get("/refresh-token", manageRefreshToken);

module.exports = routes;
