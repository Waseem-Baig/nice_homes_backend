import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  updateProfileValidation,
  changePasswordValidation,
  validate,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// User routes
router.get("/profile", protect, getUserProfile);
router.put(
  "/profile",
  protect,
  updateProfileValidation,
  validate,
  updateUserProfile
);
router.put(
  "/change-password",
  protect,
  changePasswordValidation,
  validate,
  changePassword
);

// Admin routes
router.get("/", protect, admin, getAllUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;
