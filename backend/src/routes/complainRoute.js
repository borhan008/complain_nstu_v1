const express = require("express");
const router = express.Router();
const complainController = require("../controllers/complainController");
const saveFileMiddleware = require("../middleware/saveFile");

const mutler = require("multer");
const path = require("path");
const authMiddleWare = require("../middleware/auth");

const storage = mutler.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/upload/complains");
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${
      file.originalname
    }`;
    cb(null, fileName);
  },
});
const upload = mutler({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/all/", complainController.getComplains);
router.get("/detail/:c_id", complainController.getOneComplain);
router.post(
  "/add/",
  authMiddleWare,
  upload.array("files", 10),
  (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      req.body.docs = null;
      next();
      return;
    }

    const filename = req.files.map((file) => file.filename).join(",");
    req.body.docs = filename;
    // console.log(filename);
    next();
  },
  complainController.createComplain
);

module.exports = router;
