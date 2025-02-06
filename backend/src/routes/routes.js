const express = require("express");
const router = express.Router();
const userRoute = require("./userRoute");
const complainRoute = require("./complainRoute");
const adminRoute = require("./adminRoute");
const adminMiddleware = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

router.use("/user/", userRoute);
router.use("/complain/", complainRoute);
router.use("/admin/", adminMiddleware, adminRoute);
module.exports = router;
