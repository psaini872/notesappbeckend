import express from "express";
import {
  signup,
  login,
  logout,
  protect,
  getCurrentUser,
} from "../controller/userController.js";
const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.get("/logout", logout);
router.route("/getCurrentUser").get(protect, getCurrentUser);

export default router;
