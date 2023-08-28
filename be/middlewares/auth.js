import Dean from "../models/Dean.schema.js";
import Student from "../models/student.model.js";

export const auth = (role) => async (req, res, next) => {
  if (!req.header("Authorization")) {
    res.status(401).json({
      message: "no token passed",
    });
    return;
  }
  const token = req.header("Authorization").split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token found, authorization denied" });
  }

  let user;
  if (role === "student") {
    user = await Student.findOne({ uniqueId: token });
  } else {
    user = await Dean.findOne({ uniqueId: token });
  }
  if (!user) {
    return res.status(401).json("wrong token passed");
  }
  req.user = user;
  next();
};
