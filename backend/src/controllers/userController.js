const userQueries = require("../queries/userQueries");

exports.createUser = async (req, res) => {
  const rollReg = /^[a-zA-Z]{3}\d{7}[M|F]{1}$/;
  const mobileReg = /^(\+88)?01[0-9]{9}$/;
  try {
    const { roll, mobile } = req.body;
    const { uid, email, name } = req.user;
    if (!rollReg.test(roll) || !mobileReg.test(mobile)) {
      return res
        .status(400)
        .json({ message: "Invalid roll number or mobile number" });
    }
    let localPart = email.split("@")[0];

    let matches = localPart.match(/(\d{2})(\d{2})$/);

    let d_id = matches[1];
    let batch = matches[2];
    const user = await userQueries.createUser({
      uid,
      name,
      roll,
      email,
      mobile,
      d_id,
      batch,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

exports.checkUser = async (req, res) => {
  const uid = req.user.uid;
  try {
    const user = await userQueries.checkUser(uid);
    //console.log(user);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { uid, role } = req.body;
    const result = await userQueries.updateUserRole({ uid, role });
    res.status(200).json({ message: "Role updated successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.showUserWithLimitRange = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    let { start, end } = req.query;
    start = parseInt(start);
    end = parseInt(end);

    const users = await userQueries.showUserWithLimitRange({ start, end });
    // console.log(users);
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.changeRole = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { uid, role } = req.body;
    const result = await userQueries.changeRole({ uid, role });
    res.status(200).json({ message: "Role updated successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.blockUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { uid, block } = req.body;
    const result = await userQueries.blockUser({ uid, block });
    console.log(result);
    res.status(200).json({ message: "User blocked successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.countUsers = async (req, res) => {
  try {
    const result = await userQueries.countUsers();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
