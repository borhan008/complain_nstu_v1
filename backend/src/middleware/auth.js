const admin = require("../config/firebaseAdmin");
const { checkUser } = require("../queries/userQueries");

const authMiddleWare = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decodeToken = await admin.auth().verifyIdToken(token);
    const response = await checkUser(decodeToken.uid);

    req.user = decodeToken;
    req.user.role = "notfound";

    if (response?.length > 0) {
      console.log(response[0]);
      req.user.role = response[0].role;
      if (response[0].block == 1) {
        return res.status(401).json({ message: "User blocked", logout: true });
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", err });
  }
};

module.exports = authMiddleWare;
