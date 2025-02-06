const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const deptRoute = require("./deptRoute");
const complainController = require("../controllers/complainController");

router.get("/users", userController.showUserWithLimitRange);
router.put("/role", userController.changeRole);
router.put("/block", userController.blockUser);
router.get("/countusers", userController.countUsers);
router.use("/department/", deptRoute);
router.get("/complains", complainController.getComplainsWithPagination);
router.put("/complain/status", complainController.updateStatus);
router.post("/complain/comment", complainController.addComment);
router.get("/complain/comments", complainController.getComments);
router.delete("/complain/comment/:com_id", complainController.deleteComment);
router.delete("/complain/:c_id", complainController.deleteComplainByAdmin);
module.exports = router;
