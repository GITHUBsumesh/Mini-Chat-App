import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  signup,
  logout,
  login,
  getMyProfile,
  updateProfile,
} from "../controllers/auth.controller.js";


const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/profile/update", isAuthenticated, updateProfile);
router.get("/profile", isAuthenticated, getMyProfile);

export default router;
