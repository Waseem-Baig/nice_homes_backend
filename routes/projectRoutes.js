import express from "express";
import {
  getProjects,
  getAllProjectsAdmin,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectActive,
  toggleProjectFeatured,
} from "../controllers/projectController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { projectValidation } from "../middleware/validationMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Admin routes
router.get("/admin/all", protect, admin, getAllProjectsAdmin);
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  projectValidation,
  createProject
);
router.put("/:id", protect, admin, upload.single("image"), updateProject);
router.delete("/:id", protect, admin, deleteProject);
router.patch("/:id/toggle-active", protect, admin, toggleProjectActive);
router.patch("/:id/toggle-featured", protect, admin, toggleProjectFeatured);

export default router;
