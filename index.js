const express = require("express");
const cors = require("cors");
require("./db.js");
const userRoutes = require("./routes/user.js");
const authRoutes = require("./routes/auth.js");
const { configDotenv } = require("dotenv");
configDotenv();
const cookieParser = require("cookie-parser");

const app = express();
const port = 9000;
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
