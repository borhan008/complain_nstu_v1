const express = require("express");
const app = express();
const PORT = 8000;
const bodyParser = require("body-parser");
const router = require("./src/routes/routes.js");
const authMiddleWare = require("./src/middleware/auth.js");
const userController = require("./src/controllers/userController.js");
const cors = require("cors");

const multer = require("multer");
const path = require("path");
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use("/api/", authMiddleWare, router);

app.use("/src/upload", express.static("src/upload"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
