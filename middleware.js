const { verifyJWT } = require("./utils");

const authenticateAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token not found" });
  }
  verifyJWT(token)
    .then((decoded) => {
      req.user = decoded;
      next();
    })
    .catch((err) => {
      return res.status(403).json({ message: "Invalid access token" });
    });
};

module.exports = {
  authenticateAccessToken,
};