import express from "express";
import {
  register,
  login,
  getMe,
  logout,
  verifyToken,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerValidation,
  loginValidation,
  validate,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.get("/verify", protect, verifyToken);

export default router;
