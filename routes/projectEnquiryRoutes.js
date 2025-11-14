import express from "express";
import {
  createProjectEnquiry,
  getAllProjectEnquiries,
  getProjectEnquiryById,
  updateProjectEnquiryStatus,
  toggleEnquiryRead,
  deleteProjectEnquiry,
} from "../controllers/projectEnquiryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  projectEnquiryValidation,
  validate,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public route - Create project enquiry
router.post("/", projectEnquiryValidation, validate, createProjectEnquiry);

// Admin routes - Protected
router.get("/admin/all", protect, admin, getAllProjectEnquiries);
router.get("/:id", protect, admin, getProjectEnquiryById);
router.patch("/:id/status", protect, admin, updateProjectEnquiryStatus);
router.patch("/:id/toggle-read", protect, admin, toggleEnquiryRead);
router.delete("/:id", protect, admin, deleteProjectEnquiry);

export default router;
