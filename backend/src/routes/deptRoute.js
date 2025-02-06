const express = require("express");
const router = express.Router();
const deptController = require("../controllers/departmentController.js");

router.get("/", deptController.getDepartments);
router.post("/", deptController.createDepartment);
router.put("/", deptController.editDepartment);
router.delete("/:d_id", deptController.deleteDepartment);

module.exports = router;
