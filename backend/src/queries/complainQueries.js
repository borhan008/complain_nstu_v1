const db = require("../config/db");

exports.createComplain = async ({ uid, details, docs, title }) => {
  const [result] = await db.query(
    "INSERT INTO complains (uid, details, docs, title) VALUES (?, ?, ?, ?)",
    [uid, details, docs, title]
  );
  return result;
};

exports.getComplains = async ({ uid }) => {
  const [result] = await db.query(
    "SELECT * FROM complains WHERE uid = ? ORDER BY c_id DESC",
    [uid]
  );

  return result;
};

exports.getOneComplain = async ({ c_id, uid }) => {
  const [result] = await db.query(
    "SELECT * FROM complains WHERE c_id = ? AND uid = ?",
    [c_id, uid]
  );

  return result;
};

exports.updateComplain = async ({ c_id, uid, details, docs }) => {
  const [result] = await db.query(
    "UPDATE complains SET details = ?, docs = ? WHERE c_id = ? AND uid = ?",
    [details, docs, c_id, uid]
  );

  return result;
};

exports.countComplains = async () => {
  const result = await db.query("SELECT COUNT(*) as total FROM complains");
  return result[0][0].total;
};

exports.countNotifications = async ({ uid }) => {
  const result = await db.query(
    "SELECT COUNT(*) as total FROM notifications WHERE uid = ? AND view = false",
    [uid]
  );
  return result[0][0].total;
};

exports.getCommentForUser = async ({ c_id }) => {
  const [result] = await db.query(
    "SELECT * FROM comments as C join users as U on C.uid = U.uid WHERE c_id = ? ORDER BY com_id DESC",
    [c_id]
  );

  return result;
};

exports.addUserComment = async ({ c_id, uid, comment }) => {
  const [result] = await db.query(
    "INSERT INTO comments (c_id, uid, comment, date) VALUES (?, ?, ?, ?)",
    [c_id, uid, comment, new Date()]
  );

  return result;
};

//Admin
exports.getComplainsWithPagination = async ({
  page,
  limit,
  department,
  batch,
  roll,
}) => {
  let query = `
    SELECT * 
    FROM complains as C 
    JOIN users as U ON C.uid = U.uid 
    JOIN departments as D ON D.d_id = U.d_id
  `;
  let params = [];
  let conditions = [];

  if (department && department !== "") {
    conditions.push("D.d_id = ?");
    params.push(department);
  }

  if (batch && batch !== "") {
    conditions.push("U.batch = ?");
    params.push(batch);
  }
  if (roll && roll !== "") {
    console.log(roll);
    conditions.push("U.roll = ?");
    params.push(roll);
  }
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY c_id DESC LIMIT ?, ?";
  params.push(limit * page, limit);

  const result = await db.query(query, params);
  return result;
};

exports.updateStatus = async ({ c_id, status }) => {
  const [result] = await db.query(
    "UPDATE complains SET status = ? WHERE c_id = ?",
    [status, c_id]
  );

  return result;
};

exports.deleteComplain = async ({ c_id }) => {
  const [result] = await db.query("DELETE FROM complains WHERE c_id = ?", [
    c_id,
  ]);

  return result;
};

exports.getComments = async ({ c_id }) => {
  const [result] = await db.query(
    "SELECT * FROM comments as C join users as U on C.uid = U.uid WHERE c_id = ? ORDER BY com_id DESC",
    [c_id]
  );

  return result;
};

exports.deleteComplainByAdmin = async ({ c_id }) => {
  const [result] = await db.query("DELETE FROM complains WHERE c_id = ?", [
    c_id,
  ]);

  return result;
};

exports.addComment = async ({ c_id, uid, comment }) => {
  const [result] = await db.query(
    "INSERT INTO comments (c_id, uid, comment, date) VALUES (?, ?, ?, ?)",
    [c_id, uid, comment, new Date()]
  );

  return result;
};

exports.deleteComment = async ({ com_id }) => {
  const [result] = await db.query("DELETE FROM comments WHERE com_id = ?", [
    com_id,
  ]);

  return result;
};

exports.sendNotification = async ({ c_id, uid, message }) => {
  const [result] = await db.query(
    "INSERT INTO notifications (c_id, uid, view, message, date) VALUES (?, ?, ?, ?, ?)",
    [c_id, uid, false, message, new Date()]
  );

  return result;
};

exports.getNotifications = async ({ uid }) => {
  const [result] = await db.query(
    "SELECT * FROM notifications WHERE uid = ? ORDER BY n_id DESC",
    [uid]
  );

  return result;
};

exports.updateNotification = async ({ uid }) => {
  const [result] = await db.query(
    "UPDATE notifications SET view = true WHERE uid = ?",
    [uid]
  );

  return result;
};
