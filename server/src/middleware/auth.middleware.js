import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const {token} = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You need to login first",
      });
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    req.user = await User.findById(decoded._id).select("-password");
    next();
  } catch (error) {
    console.log("Error in isAuthenticated middleware: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
