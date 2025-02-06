const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const complainController = require("../controllers/complainController");
router.get("/check/", userController.checkUser);
router.post("/", userController.createUser);

router.get("/notifications/count", complainController.countNotifications);
router.get("/notifications", complainController.getNotifications);
router.put("/notifications/", complainController.updateNotification);
router.get("/comments", complainController.getCommentForUser);
router.post("/comment", complainController.addUserComment);
module.exports = router;
