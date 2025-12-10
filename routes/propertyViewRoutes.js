import express from "express";
import {
  trackPropertyView,
  getAllPropertyViews,
  getViewsByProject,
  updateViewStatus,
  deletePropertyView,
  getViewStats,
} from "../controllers/propertyViewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - track property view
router.post("/", trackPropertyView);

// Admin routes
router.get("/admin/all", protect, admin, getAllPropertyViews);
router.get("/admin/stats", protect, admin, getViewStats);
router.get("/project/:projectId", protect, admin, getViewsByProject);
router.put("/:id/status", protect, admin, updateViewStatus);
router.delete("/:id", protect, admin, deletePropertyView);

export default router;
