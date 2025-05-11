const { Router } = require("express");
const routes = Router();
const { login, logout, manageRefreshToken } = require("../controllers/auth.js");

routes.post("/login", login);

routes.get("/logout", logout);

routes.get("/refresh-token", manageRefreshToken);

module.exports = routes;
