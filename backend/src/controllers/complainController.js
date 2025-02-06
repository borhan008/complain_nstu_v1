const complainQueries = require("../queries/complainQueries");

exports.createComplain = async (req, res) => {
  try {
    const { uid } = req.user;
    const { details, docs, title } = req.body;
    const complain = await complainQueries.createComplain({
      uid,
      details,
      docs,
      title,
    });
    return res
      .status(201)
      .json({ message: "Complain created successfully", data: complain });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getComplains = async (req, res) => {
  try {
    const complains = await complainQueries.getComplains({ uid: req.user.uid });
    return res.status(200).json({ complains });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

exports.getOneComplain = async (req, res) => {
  const { c_id } = req.params;
  try {
    const complains = await complainQueries.getOneComplain({
      c_id,
      uid: req.user.uid,
    });
    if (complains.length === 0)
      return res.status(404).json({ message: "Complain not found" });
    return res.status(200).json({ complains });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

exports.countNotifications = async (req, res) => {
  try {
    const count = await complainQueries.countNotifications({
      uid: req.user.uid,
    });
    return res.status(200).json({ count });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await complainQueries.getNotifications({
      uid: req.user.uid,
    });
    return res.status(200).json({ notifications });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};
exports.updateNotification = async (req, res) => {
  try {
    const { uid } = req.user;

    const result = await complainQueries.updateNotification({ uid });
    return res
      .status(200)
      .json({ message: "Notification updated successfully", result });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

exports.getCommentForUser = async (req, res) => {
  try {
    const { c_id, u_id } = req.query;
    console.log(req.user.uid, u_id);
    if (req.user.uid != u_id)
      return res.status(403).json({ message: "Forbidden" });
    const comments = await complainQueries.getCommentForUser({ c_id });
    return res.status(200).json({ comments });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

exports.addUserComment = async (req, res) => {
  try {
    const { c_id, comment, u_id } = req.body;
    if (req.user.uid != u_id)
      return res.status(403).json({ message: "Forbidden" });
    const result = await complainQueries.addUserComment({
      c_id,
      uid: req.user.uid,
      comment,
    });
    return res
      .status(200)
      .json({ message: "Comment added successfully", result });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

// Admins

exports.getComplainsWithPagination = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    let { page, limit, department, batch, roll } = req.query;
    console.log(department, batch);
    page = parseInt(page);
    limit = parseInt(limit);
    console.log(page, limit);
    if (department == "All") department = "";
    const countComplains = await complainQueries.countComplains();
    const complains = await complainQueries.getComplainsWithPagination({
      page,
      limit,
      department,
      batch,
      roll,
    });
    return res.status(200).json({ complains, count: countComplains });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { c_id, status, u_id } = req.body;
    const result = await complainQueries.updateStatus({ c_id, status });

    const sendNotification = await complainQueries.sendNotification({
      c_id,
      uid: u_id,
      message: `Your complain status updated to ${status}`,
    });
    return res
      .status(200)
      .json({ message: "Status updated successfully", result });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { c_id, u_id, comment } = req.body;
    const result = await complainQueries.addComment({
      c_id,
      uid: req.user.uid,
      comment,
    });

    const sendNotification = await complainQueries.sendNotification({
      c_id,
      uid: u_id,
      message: "A new comment on your complain",
    });

    return res
      .status(200)
      .json({ message: "Comment added successfully", result });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deleteComplainByAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { c_id } = req.params;
    const result = await complainQueries.deleteComplainByAdmin({ c_id });
    return res
      .status(200)
      .json({ message: "Complain deleted successfully", result });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { c_id } = req.query;
    const comments = await complainQueries.getComments({ c_id });
    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { com_id } = req.params;
    const result = await complainQueries.deleteComment({ com_id });
    return res
      .status(200)
      .json({ message: "Comment deleted successfully", result });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
