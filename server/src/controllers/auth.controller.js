import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middleware/error.middleware.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return next(new ErrorHandler("Invalid Username Or Password", 400));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return next(new ErrorHandler("Invalid Username Or Password", 400));

    sendCookie(user, res, `Okairi ${user.name}`);
  } catch (err) {
    next(err);
  }
};
export const logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "lax",
        secure: false,
      })
      .json({
        success: true,
        message: "Logged Out Successfully",
        user: req.user,
      });
  } catch (err) {
    next(err);
  }
};
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User Already Exists", 400));
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    sendCookie(user, res, `Yokoso ${user.name}`, 201);
  } catch (err) {
    next(err);
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic)
      return next(new ErrorHandler("Please upload a profile picture", 400));
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    if (!user)
      return next(new ErrorHandler("Invalid Username Or Password", 400));

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};
export const getMyProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};
