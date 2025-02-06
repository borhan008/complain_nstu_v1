const express = require("express");
const mutler = require("multer");
const path = require("path");

const saveFileMiddleware = async (req, res, next) => {
  // console.log(req);
  req.body.details = req.details;
  if (!req.files || Object.keys(req.files).length === 0) {
    req.body.docs = null;
    next();
    return;
  }

  const storage = mutler.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/complains");
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
  }).array("files", 10);

  upload(req, res, async (err) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      req.body.docs = null;
      req.body.details = req.details;
      next();
    }
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }

    const filename = req.files.map((file) => file.fileOriginalname).join(",");
    req.body.docs = filename;
  });

  next();
  return;
};

module.exports = saveFileMiddleware;
