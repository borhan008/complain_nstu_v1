const deptQueries = require("../queries/departmentQueries");

exports.createDepartment = async (req, res) => {
  try {
    const { d_id, en_name, bn_name, shortform, est } = req.body;
    const department = await deptQueries.createDepartment({
      d_id,
      en_name,
      bn_name,
      shortform,
      est,
    });
    return res.status(201).json({
      message: "Department created successfully",
      data: department,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.editDepartment = async (req, res) => {
  try {
    const { d_id, en_name, bn_name, shortform, est } = req.body;
    const department = await deptQueries.editDepartment({
      d_id,
      en_name,
      bn_name,
      shortform,
      est,
    });
    return res.status(200).json({
      message: "Department updated successfully",
      data: department,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { d_id } = req.params;
    console.log(d_id);
    const department = await deptQueries.deleteDepartment({ d_id });
    return res.status(200).json({
      message: "Department deleted successfully",
      data: department,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await deptQueries.getDepartments();
    return res.status(200).json({ departments });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
