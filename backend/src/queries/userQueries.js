const db = require("../config/db");

exports.createUser = async ({
  uid,
  name,
  roll,
  email,
  mobile,
  d_id,
  batch,
}) => {
  try {
    const check = await this.checkUser(uid);

    if (check.length === 0) {
      const [result] = await db.query(
        "INSERT INTO users (uid, name, roll, email, mobile, d_id, batch) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [uid, name, roll, email, mobile, d_id, batch]
      );
      return result;
    } else {
      const [result] = await db.query(
        "UPDATE users SET  roll = ?, mobile = ? WHERE uid = ?",
        [roll, mobile, uid]
      );
      return result;
    }
  } catch (error) {
    throw error;
  }
};

exports.countUsers = async () => {
  const [result] = await db.query("SELECT COUNT(*) as count FROM users");

  return result;
};

exports.checkUser = async (uid) => {
  const [result] = await db.query(
    "SELECT uid, roll, mobile, role, block FROM users WHERE uid = ?",
    [uid]
  );

  return result;
};

exports.updateUserRole = async ({ uid, role }) => {
  try {
    const [result] = await db.query("UPDATE users SET role = ? WHERE uid = ?", [
      role,
      uid,
    ]);

    return result;
  } catch (error) {
    return error;
  }
};

exports.showUserWithLimitRange = async ({ start, end }) => {
  const [result] = await db.query(
    "SELECT * FROM users as X join departments as Y on X.d_id = Y.d_id LIMIT ?, ?",
    [start, end]
  );

  return result;
};

exports.changeRole = async ({ uid, role }) => {
  try {
    const [result] = await db.query("UPDATE users SET role = ? WHERE uid = ?", [
      role,
      uid,
    ]);

    return result;
  } catch (error) {
    throw error;
  }
};

exports.blockUser = async ({ uid, block }) => {
  try {
    const [result] = await db.query(
      "UPDATE users SET block = ? WHERE uid = ?",
      [block, uid]
    );

    return result;
  } catch (error) {
    throw error;
  }
};
