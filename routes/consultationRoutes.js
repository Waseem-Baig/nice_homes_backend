import express from "express";
import {
  createConsultation,
  getAllConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation,
  getMyConsultations,
} from "../controllers/consultationController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  consultationValidation,
  validate,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public route
router.post("/", consultationValidation, validate, createConsultation);

// Protected route - user's own consultations
router.get("/my-consultations", protect, getMyConsultations);

// Admin routes
router.get("/", protect, admin, getAllConsultations);
router.get("/:id", protect, admin, getConsultationById);
router.put("/:id", protect, admin, updateConsultation);
router.delete("/:id", protect, admin, deleteConsultation);

export default router;
