const express = require("express");
const cors = require("cors");
require("./db.js");
const routes = require("./routes/user.js");
const bodyParser = require("body-parser");

const app = express();
const port = 9000;
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user", routes);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
