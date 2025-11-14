import express from "express";
import {
  getTestimonials,
  getAllTestimonialsAdmin,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialActive,
  toggleTestimonialFeatured,
} from "../controllers/testimonialController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { testimonialValidation } from "../middleware/validationMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getTestimonials);
router.get("/:id", getTestimonialById);

// Admin routes
router.get("/admin/all", protect, admin, getAllTestimonialsAdmin);
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  testimonialValidation,
  createTestimonial
);
router.put("/:id", protect, admin, upload.single("image"), updateTestimonial);
router.delete("/:id", protect, admin, deleteTestimonial);
router.patch("/:id/toggle-active", protect, admin, toggleTestimonialActive);
router.patch("/:id/toggle-featured", protect, admin, toggleTestimonialFeatured);

export default router;
