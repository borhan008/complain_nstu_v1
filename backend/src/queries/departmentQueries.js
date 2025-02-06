const db = require("../config/db");

exports.createDepartment = async ({
  d_id,
  en_name,
  bn_name,
  shortform,
  est,
}) => {
  try {
    const [result] = await db.query(
      "INSERT INTO departments (d_id, en_name, bn_name,shortform, est) VALUES (?, ?, ?,?, ?)",
      [d_id, en_name, bn_name, shortform, est]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

exports.editDepartment = async ({ d_id, en_name, bn_name, shortform, est }) => {
  try {
    const [result] = await db.query(
      "UPDATE departments SET en_name = ?, bn_name = ?, shortform = ?, est = ? WHERE d_id = ?",
      [en_name, bn_name, shortform, est, d_id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

exports.deleteDepartment = async ({ d_id }) => {
  try {
    const [result] = await db.query("DELETE FROM departments WHERE d_id = ?", [
      d_id,
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.getDepartments = async () => {
  try {
    const [result] = await db.query("SELECT * FROM departments");
    return result;
  } catch (error) {
    throw error;
  }
};
